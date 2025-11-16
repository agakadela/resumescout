import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { usePuterStore } from '~/lib/puter';
import Summary from '~/components/Summary';
import ATS from '~/components/ATS';
import Details from '~/components/Details';

const meta = {
  title: 'Resume Scout | Resume',
  description:
    'Review and improve your resume with the help of our AI-powered tool.',
};

export default function Resume() {
  const { id } = useParams();
  const { kv, fs, auth, isLoading } = usePuterStore();
  const navigate = useNavigate();

  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate('/auth?next=/resume/${id}');
    }
  }, [isLoading, auth.isAuthenticated]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);

      if (!resume) {
        throw new Error('Resume not found');
      }

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) {
        throw new Error('Failed to read resume');
      }

      const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
      setResumeUrl(URL.createObjectURL(pdfBlob));

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) {
        throw new Error('Failed to read image');
      }
      setImageUrl(URL.createObjectURL(imageBlob));
      setFeedback(data.feedback);
    };
    loadResume();
  }, [id]);

  return (
    <main className='pt-0!'>
      <nav className='resume-nav'>
        <Link to='/' className='back-button'>
          <img src='/icons/back.svg' alt='Back' className='w-2.5 h-2.5' />
          <span className='text-gray-800 text-sm font-semibold'>
            Back to Home
          </span>
        </Link>
      </nav>
      <div className='flex flex-row w-full max-lg:flex-col-reverse'>
        <section className='feedback-section bg-[url(/images/bg-small.svg)] bg-cover h-100vh sticky top-0 items-center justify-center'>
          {imageUrl && resumeUrl && (
            <div className='animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit'>
              <a href={resumeUrl} target='_blank' rel='noopener noreferrer'>
                <img
                  src={imageUrl}
                  alt='Resume'
                  title='Resume'
                  className='w-full h-full object-contain rounded-2xl'
                />
              </a>
            </div>
          )}
        </section>
        <section className='feedback-section '>
          <h2 className='text-4xl text-black! font-bold'>Resume Review</h2>
          {feedback ? (
            <div className='flex flex-col gap-8 animate-in fade-in duration-1000'>
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img src='/images/resume-scan-2.gif' className='w-full' />
          )}
        </section>
      </div>
    </main>
  );
}

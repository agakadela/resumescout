import type { Route } from './+types/home';
import NavBar from '../components/NavBar';
import ResumeCard from '~/components/ResumeCard';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { usePuterStore } from '~/lib/puter';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Resume Scout' },
    {
      name: 'description',
      content:
        'Resume Scout is a tool that helps check your resume for job applications.',
    },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated && !isLoading) {
      navigate('/auth?next=/');
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setIsLoading(true);
      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );
      setResumes(parsedResumes);
      setIsLoading(false);
    };
    loadResumes();
  }, []);

  return (
    <main className='bg-[url(/images/bg-main.svg)] bg-cover '>
      <NavBar />
      <section className='main-section'>
        <div className='page-heading py-16'>
          <h1> Track Your Job Applications and Ratings</h1>
          {!isLoading && resumes?.length === 0 ? (
            <h2>No resumes found. Please upload a resume to get started.</h2>
          ) : (
            <h2>
              Review and improve your resume with the help of our AI-powered
              tool.
            </h2>
          )}
        </div>
        {isLoading && (
          <div className='flex flex-col items-center justify-center'>
            <img src='/images/resume-scan-2.gif' className='w-[200px]' />
          </div>
        )}
        {resumes.length > 0 ? (
          <div className='resumes-section'>
            {resumes.map((resume: Resume) => (
              <ResumeCard key={resume.id} {...resume} />
            ))}
          </div>
        ) : (
          <div className='resumes-section'>
            <p>No resumes found</p>
          </div>
        )}

        {!isLoading && resumes?.length === 0 && (
          <div className='flex flex-col items-center justify-center mt-10 g-4'>
            <Link
              to='/upload'
              className='primary-button w-fit text-xl font-semibolds'
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

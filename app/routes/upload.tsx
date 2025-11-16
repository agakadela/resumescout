import NavBar from '~/components/NavBar';
import { useState } from 'react';
import FileUploader from '~/components/FileUploader';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from '~/lib/pdf2img';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions, AIResponseFormat } from '../../constants/';

export default function Upload() {
  const { fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File | null;
  }) => {
    if (!file) {
      setStatusText('Please upload a resume before analyzing');
      throw new Error('Please upload a resume before analyzing');
    }

    setIsProcessing(true);
    setStatusText('Processing your resume...');
    const uploadedFile = await fs.upload([file]);

    if (!uploadedFile) {
      setStatusText('Failed to upload your resume');
      setIsProcessing(false);
      throw new Error('Failed to upload your resume');
    }
    setStatusText('Converting to image...');
    const imageConversion = await convertPdfToImage(file);
    if (!imageConversion.file) {
      setStatusText(
        imageConversion.error ?? 'Failed to convert your resume to image'
      );
    }

    setStatusText('Uploading the image...');
    const uploadedImage = await fs.upload([imageConversion.file as Blob]);
    if (!uploadedImage) {
      setStatusText('Failed to upload the image');
      setIsProcessing(false);
      throw new Error('Failed to upload the image');
    }
    setStatusText('Preparing data for analysis...');
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: '',
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText('Analyzing...');
    const feedback = await ai.feedback(
      uploadedImage.path,
      prepareInstructions({
        jobTitle,
        jobDescription,
        AIResponseFormat,
      })
    );
    if (!feedback) {
      setStatusText('Failed to analyze your resume');
      setIsProcessing(false);
      throw new Error('Failed to analyze your resume');
    }
    const feedbackText =
      typeof feedback.message.content === 'string'
        ? feedback.message.content
        : feedback.message.content[0].text;
    data.feedback = JSON.parse(feedbackText);

    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText('Analysis complete');
    setIsProcessing(false);
    navigate(`/resume/${uuid}`);
  };

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    if (!companyName || !jobTitle || !jobDescription || !file) {
      setStatusText('Please fill in all fields and upload a resume');
      return;
    }
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };
  return (
    <main className='bg-[url(/images/bg-main.svg)] bg-cover '>
      <NavBar />
      <section className='main-section'>
        <div className='page-heading py-16'>
          <h1>Smart feedback for your resume</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src='/images/resume-scan.gif'
                className='w-full'
                alt='Resume Scan'
              />
            </>
          ) : (
            <h2>Upload your resume to get an ATS score and improvement tips</h2>
          )}
          {!isProcessing && (
            <form
              id='upload-form'
              onSubmit={handleUpload}
              className='flex flex-col gap-4 mt-8'
            >
              <div className='form-div'>
                <label htmlFor='company-name'>Company Name</label>
                <input
                  type='text'
                  id='company-name'
                  name='company-name'
                  placeholder='Enter the company name'
                />
              </div>
              <div className='form-div'>
                <label htmlFor='job-title'>Job Title</label>
                <input
                  type='text'
                  id='job-title'
                  name='job-title'
                  placeholder='Enter the job title'
                />
              </div>
              <div className='form-div'>
                <label htmlFor='job-description'>Job Description</label>
                <textarea
                  id='job-description'
                  name='job-description'
                  placeholder='Enter the job description'
                  rows={5}
                ></textarea>
              </div>
              <div className='form-div'>
                <label htmlFor='uploader'>Upload your resume</label>
                <FileUploader onFileUpload={handleFileUpload} />
              </div>
              <button
                type='submit'
                className='primary-button'
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Analyze resume'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

import NavBar from '~/components/NavBar';
import { useState } from 'react';
import FileUploader from '~/components/FileUploader';

export default function Upload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (file: File | null) => {
    setFile(file);
  };
  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatusText('Processing your resume...');
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

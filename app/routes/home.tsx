import type { Route } from './+types/home';
import NavBar from '../components/NavBar';
import { RESUMES } from '../../constants';
import ResumeCard from '~/components/ResumeCard';

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
  return (
    <main className='bg-[url(/images/bg-main.svg)] bg-cover '>
      <NavBar />
      <section className='main-section'>
        <div className='page-heading py-16'>
          <h1> Track Your Job Applications and Ratings</h1>
          <h2>
            Review and improve your resume with the help of our AI-powered tool.
          </h2>
        </div>
        {RESUMES.length > 0 ? (
          <div className='resumes-section'>
            {[
              ...RESUMES.map((resume: Resume) => (
                <ResumeCard key={resume.id} {...resume} />
              )),
            ]}
          </div>
        ) : (
          <div className='resumes-section'>
            <p>No resumes found</p>
          </div>
        )}
      </section>
    </main>
  );
}

import { useEffect } from 'react';
import type { Route } from './+types/auth';
import { usePuterStore } from '~/lib/puter';
import { useLocation, useNavigate } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Resume Scout | Auth' },
    {
      name: 'description',
      content: 'Login to your account',
    },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  return {};
}

export default function Auth() {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const nextPath = location.search.split('next=')[1] || '/';
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(nextPath);
    }
  }, [auth.isAuthenticated, nextPath]);

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className='gradient-border shadow-lg'>
        <section className='flex flex-col gap-8 bg-white rounded-2xl p-8'>
          <div className='flex flex-col gap-2 items-center text-center'>
            <h1>Welcome</h1>
            <p>Login to your account to continue</p>
          </div>
          <div>
            {isLoading ? (
              <button className='auth-button animate-pulse'> Loading...</button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button className='auth-button' onClick={auth.signOut}>
                    <p>Log Out</p>
                  </button>
                ) : (
                  <button className='auth-button' onClick={auth.signIn}>
                    <p>Log In</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

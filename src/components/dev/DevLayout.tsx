import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevAuth } from '@/contexts/DevAuthContext';
import { DevHeader } from './DevHeader';
import { DevSidebar } from './DevSidebar';

interface DevLayoutProps {
  children: ReactNode;
}

export function DevLayout({ children }: DevLayoutProps) {
  const { isAuthenticated, validateToken } = useDevAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !validateToken()) {
      navigate('/dev');
    }
  }, [isAuthenticated, navigate, validateToken]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DevHeader />
      <DevSidebar />
      <main className="ml-64 pt-14">
        <div className="container max-w-screen-xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

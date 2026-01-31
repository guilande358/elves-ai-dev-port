import { useDevAuth } from '@/contexts/DevAuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DevHeader() {
  const { logout } = useDevAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/dev');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Portal Dev</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  );
}

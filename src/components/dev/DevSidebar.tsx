import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FolderKanban, Sparkles, User, Home } from 'lucide-react';

const navItems = [
  { to: '/dev/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dev/projects', icon: FolderKanban, label: 'Projetos' },
  { to: '/dev/skills', icon: Sparkles, label: 'Skills' },
  { to: '/dev/profile', icon: User, label: 'Perfil' },
];

export function DevSidebar() {
  return (
    <aside className="fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r border-border/40 bg-background">
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
        <hr className="my-4 border-border/40" />
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Home className="h-4 w-4" />
          Ver Portfolio
        </a>
      </nav>
    </aside>
  );
}

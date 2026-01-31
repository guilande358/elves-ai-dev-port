import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DevLayout } from '@/components/dev/DevLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { FolderKanban, Sparkles, User, ArrowRight } from 'lucide-react';

interface Stats {
  projects: number;
  skills: number;
  hasProfile: boolean;
}

export default function DevDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, skills: 0, hasProfile: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projectsRes, skillsRes, profileRes] = await Promise.all([
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('skills').select('id', { count: 'exact', head: true }),
          supabase.from('profile_settings').select('id').limit(1),
        ]);

        setStats({
          projects: projectsRes.count || 0,
          skills: skillsRes.count || 0,
          hasProfile: (profileRes.data?.length || 0) > 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Projetos',
      description: 'Gerencie seus projetos do portfolio',
      icon: FolderKanban,
      to: '/dev/projects',
      stat: `${stats.projects} projetos`,
    },
    {
      title: 'Skills',
      description: 'Edite suas habilidades técnicas',
      icon: Sparkles,
      to: '/dev/skills',
      stat: `${stats.skills} skills`,
    },
    {
      title: 'Perfil',
      description: 'Atualize suas informações pessoais',
      icon: User,
      to: '/dev/profile',
      stat: stats.hasProfile ? 'Configurado' : 'Não configurado',
    },
  ];

  return (
    <DevLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao portal de desenvolvimento. Gerencie seu portfolio aqui.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.to} to={card.to}>
              <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? '...' : card.stat}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                    {card.description}
                    <ArrowRight className="h-3 w-3" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DevLayout>
  );
}

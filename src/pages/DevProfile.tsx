import { useEffect, useState } from 'react';
import { DevLayout } from '@/components/dev/DevLayout';
import { ProfileForm } from '@/components/dev/ProfileForm';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProfileSettings {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  years_experience: number;
  projects_delivered: number;
  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  location: string | null;
  available_for_work: boolean;
}

export default function DevProfile() {
  const [profile, setProfile] = useState<ProfileSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profile_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSuccess = () => {
    fetchProfile();
  };

  return (
    <DevLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
          <p className="text-muted-foreground">Atualize suas informações pessoais</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>
              Estas informações serão exibidas no seu portfolio público.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ProfileForm profile={profile} onSuccess={handleSuccess} />
            )}
          </CardContent>
        </Card>
      </div>
    </DevLayout>
  );
}

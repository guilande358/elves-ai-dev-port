import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDevCrud } from '@/hooks/useDevCrud';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  title: z.string().optional(),
  bio: z.string().optional(),
  years_experience: z.number().int().min(0),
  projects_delivered: z.number().int().min(0),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  github_url: z.string().url('URL inválida').optional().or(z.literal('')),
  linkedin_url: z.string().url('URL inválida').optional().or(z.literal('')),
  location: z.string().optional(),
  available_for_work: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

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

interface ProfileFormProps {
  profile?: ProfileSettings | null;
  onSuccess: () => void;
}

export function ProfileForm({ profile, onSuccess }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { createItem, updateItem } = useDevCrud();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || 'Elves Guilande',
      title: profile?.title || '',
      bio: profile?.bio || '',
      years_experience: profile?.years_experience || 3,
      projects_delivered: profile?.projects_delivered || 20,
      email: profile?.email || '',
      github_url: profile?.github_url || '',
      linkedin_url: profile?.linkedin_url || '',
      location: profile?.location || '',
      available_for_work: profile?.available_for_work ?? true,
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);

    const data = {
      name: values.name,
      title: values.title || null,
      bio: values.bio || null,
      years_experience: values.years_experience,
      projects_delivered: values.projects_delivered,
      email: values.email || null,
      github_url: values.github_url || null,
      linkedin_url: values.linkedin_url || null,
      location: values.location || null,
      available_for_work: values.available_for_work,
    };

    let result;
    if (profile) {
      result = await updateItem('profile_settings', profile.id, data);
    } else {
      result = await createItem('profile_settings', data);
    }

    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Sucesso',
        description: 'Perfil atualizado com sucesso.',
      });
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título Profissional</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Desenvolvedor Web" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Fale um pouco sobre você..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="years_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anos de Experiência</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projects_delivered"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Projetos Entregues</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Brasil" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="github_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="available_for_work"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Disponível para Trabalho</FormLabel>
                <FormDescription>
                  Mostrar badge de disponibilidade no portfolio
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Form>
  );
}

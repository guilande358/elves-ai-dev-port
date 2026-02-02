import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDevCrud } from '@/hooks/useDevCrud';
import { useDevAuth } from '@/contexts/DevAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, Link, Upload } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { supabase } from '@/integrations/supabase/client';

const projectSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  tags: z.string(),
  image_url: z.string().optional(),
  live_url: z.string().url('URL inválida').optional().or(z.literal('')),
  github_url: z.string().url('URL inválida').optional().or(z.literal('')),
  order_index: z.number().int().min(0),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  order_index: number;
}

interface ProjectFormProps {
  project?: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
  const { createItem, updateItem } = useDevCrud();
  const { token } = useDevAuth();
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      tags: project?.tags?.join(', ') || '',
      image_url: project?.image_url || '',
      live_url: project?.live_url || '',
      github_url: project?.github_url || '',
      order_index: project?.order_index || 0,
    },
  });

  const liveUrl = form.watch('live_url');

  const handleGenerateDescription = async () => {
    const url = form.getValues('live_url');
    
    if (!url) {
      toast({
        title: 'URL necessária',
        description: 'Insira a URL do projeto para gerar a descrição automaticamente.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-project', {
        body: { url },
        headers: {
          'x-dev-token': token!,
        },
      });

      if (error) throw new Error(error.message);
      if (!data.success) throw new Error(data.error);

      form.setValue('description', data.description);
      
      // Optionally set title if empty
      if (!form.getValues('title') && data.title) {
        form.setValue('title', data.title);
      }

      toast({
        title: 'Descrição gerada',
        description: 'A descrição foi preenchida automaticamente. Você pode editá-la livremente.',
      });
    } catch (error) {
      console.error('Generate description error:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao gerar descrição',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (url: string) => {
    form.setValue('image_url', url);
  };

  const onSubmit = async (values: ProjectFormValues) => {
    setIsLoading(true);

    const data = {
      title: values.title,
      description: values.description,
      tags: values.tags.split(',').map(t => t.trim()).filter(Boolean),
      image_url: values.image_url || null,
      live_url: values.live_url || null,
      github_url: values.github_url || null,
      order_index: values.order_index,
    };

    let result;
    if (project) {
      result = await updateItem('projects', project.id, data);
    } else {
      result = await createItem('projects', data);
    }

    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Sucesso',
        description: project ? 'Projeto atualizado com sucesso.' : 'Projeto criado com sucesso.',
      });
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Nome do projeto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <div className="space-y-2">
                <FormControl>
                  <Textarea placeholder="Descreva o projeto..." {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating || !liveUrl}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Gerar com IA
                </Button>
                <FormDescription>
                  {liveUrl 
                    ? 'Clique em "Gerar com IA" para criar uma descrição automática baseada no site.'
                    : 'Adicione a URL do projeto para habilitar a geração automática.'
                  }
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="React, TypeScript, Tailwind" {...field} />
              </FormControl>
              <FormDescription>Separe as tags por vírgula</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagem do Projeto</FormLabel>
              <Tabs value={imageTab} onValueChange={(v) => setImageTab(v as 'url' | 'upload')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url" className="gap-2">
                    <Link className="h-4 w-4" />
                    URL
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="url">
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                </TabsContent>
                <TabsContent value="upload">
                  <ImageUpload 
                    onUploadComplete={handleImageUpload}
                    currentUrl={field.value}
                  />
                </TabsContent>
              </Tabs>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="live_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL do Projeto</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL do GitHub</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="order_index"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordem</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>Menor número = aparece primeiro</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {project ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

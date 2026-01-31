import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDevCrud } from '@/hooks/useDevCrud';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

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
  const { createItem, updateItem } = useDevCrud();
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
              <FormControl>
                <Textarea placeholder="Descreva o projeto..." {...field} />
              </FormControl>
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
              <FormLabel>URL da Imagem</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
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

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
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';

const skillSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  level: z.number().min(0).max(100),
  order_index: z.number().int().min(0),
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface Skill {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: number;
  order_index: number;
}

interface SkillFormProps {
  skill?: Skill | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SkillForm({ skill, onSuccess, onCancel }: SkillFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { createItem, updateItem } = useDevCrud();
  const { toast } = useToast();

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      title: skill?.title || '',
      description: skill?.description || '',
      icon: skill?.icon || 'Code',
      level: skill?.level || 50,
      order_index: skill?.order_index || 0,
    },
  });

  const onSubmit = async (values: SkillFormValues) => {
    setIsLoading(true);

    let result;
    if (skill) {
      result = await updateItem('skills', skill.id, values);
    } else {
      result = await createItem('skills', values);
    }

    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Sucesso',
        description: skill ? 'Skill atualizada com sucesso.' : 'Skill criada com sucesso.',
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
                <Input placeholder="Ex: React" {...field} />
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
                <Textarea placeholder="Descreva a skill..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ícone (Lucide)</FormLabel>
              <FormControl>
                <Input placeholder="Code, Database, Globe..." {...field} />
              </FormControl>
              <FormDescription>
                Nome do ícone do Lucide Icons (ex: Code, Database, Globe, Palette)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nível de Proficiência: {field.value}%</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            {skill ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

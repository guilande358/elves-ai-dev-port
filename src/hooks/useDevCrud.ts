import { supabase } from '@/integrations/supabase/client';
import { useDevAuth } from '@/contexts/DevAuthContext';
import { useToast } from '@/hooks/use-toast';

type TableName = 'projects' | 'skills' | 'profile_settings';
type CrudAction = 'create' | 'update' | 'delete';

export function useDevCrud() {
  const { token, validateToken } = useDevAuth();
  const { toast } = useToast();

  const performCrud = async (
    action: CrudAction,
    table: TableName,
    data?: Record<string, unknown>,
    id?: string
  ) => {
    if (!validateToken()) {
      toast({
        title: 'Sessão expirada',
        description: 'Por favor, faça login novamente.',
        variant: 'destructive',
      });
      return { success: false, error: 'Token inválido' };
    }

    try {
      const { data: responseData, error } = await supabase.functions.invoke('dev-crud', {
        body: { action, table, data, id },
        headers: {
          'x-dev-token': token!,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!responseData.success) {
        throw new Error(responseData.error);
      }

      return { success: true, data: responseData.data };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return { success: false, error: message };
    }
  };

  const createItem = (table: TableName, data: Record<string, unknown>) =>
    performCrud('create', table, data);

  const updateItem = (table: TableName, id: string, data: Record<string, unknown>) =>
    performCrud('update', table, data, id);

  const deleteItem = (table: TableName, id: string) =>
    performCrud('delete', table, undefined, id);

  return { createItem, updateItem, deleteItem };
}

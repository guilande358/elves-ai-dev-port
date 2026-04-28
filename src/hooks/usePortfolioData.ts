import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type ProjectRow = Tables<'projects'>;
export type SkillRow = Tables<'skills'>;

function useTableData<T>(table: 'projects' | 'skills') {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const { data: rows, error: err } = await supabase
      .from(table)
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
      setData([]);
    } else {
      setData((rows ?? []) as unknown as T[]);
      setError(null);
    }
    setLoading(false);
  }, [table]);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, fetchData]);

  return { data, loading, error };
}

export function useProjects() {
  return useTableData<ProjectRow>('projects');
}

export function useSkills() {
  return useTableData<SkillRow>('skills');
}

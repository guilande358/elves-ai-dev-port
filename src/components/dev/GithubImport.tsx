import { useState } from 'react';
import { Github, Loader2, Search, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useDevAuth } from '@/contexts/DevAuthContext';
import { useToast } from '@/hooks/use-toast';

export interface GithubResult {
  title: string;
  description: string;
  tags: string[];
  live_url: string | null;
  github_url: string;
  image_url: string | null;
  icon_url?: string | null;
  screenshots?: string[];
}

interface Repo { name: string; html_url: string; description: string | null; language: string | null }

export function GithubImport({ onResult }: { onResult: (r: GithubResult) => void }) {
  const { token } = useDevAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState('guilande358');
  const [repoUrl, setRepoUrl] = useState('');
  const [repos, setRepos] = useState<Repo[]>([]);
  const [listing, setListing] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  const call = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke('analyze-github', { body, headers: { 'x-dev-token': token! } });
    if (error) {
      let msg = error.message;
      try { msg = JSON.parse(await (error as any).context.text()).error || msg; } catch { /* keep */ }
      throw new Error(msg);
    }
    if (!data.success) throw new Error(data.error);
    return data;
  };

  const listRepos = async () => {
    setListing(true);
    try { setRepos((await call({ action: 'list', username })).repos); }
    catch (e) { toast({ title: 'Erro', description: (e as Error).message, variant: 'destructive' }); }
    finally { setListing(false); }
  };

  const analyze = async (url: string) => {
    if (!url) return;
    setAnalyzing(url);
    try {
      onResult(await call({ repoUrl: url }));
      toast({ title: 'Repositório analisado', description: 'Campos preenchidos. Revise e salve.' });
    } catch (e) { toast({ title: 'Erro', description: (e as Error).message, variant: 'destructive' }); }
    finally { setAnalyzing(null); }
  };

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium"><Github className="h-4 w-4" /> Importar do GitHub</div>
      <div className="flex gap-2">
        <Input placeholder="https://github.com/usuario/repositorio" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} />
        <Button type="button" variant="outline" onClick={() => analyze(repoUrl)} disabled={!repoUrl || !!analyzing} className="gap-2 shrink-0">
          {analyzing === repoUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} Analisar
        </Button>
      </div>
      <div className="flex gap-2">
        <Input placeholder="usuário GitHub" value={username} onChange={e => setUsername(e.target.value)} />
        <Button type="button" variant="outline" onClick={listRepos} disabled={!username || listing} className="gap-2 shrink-0">
          {listing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Meus repositórios
        </Button>
      </div>
      {repos.length > 0 && (
        <ul className="max-h-56 overflow-y-auto divide-y divide-border rounded-md border border-border">
          {repos.map(r => (
            <li key={r.html_url} className="flex items-center justify-between gap-2 p-2 text-sm">
              <div className="min-w-0">
                <p className="font-mono truncate">{r.name}</p>
                <p className="text-xs text-muted-foreground truncate">{r.language || '—'} · {r.description || 'sem descrição'}</p>
              </div>
              <Button type="button" size="sm" variant="ghost" onClick={() => analyze(r.html_url)} disabled={!!analyzing}>
                {analyzing === r.html_url ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Usar'}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

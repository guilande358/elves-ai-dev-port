import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevAuth } from '@/contexts/DevAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Code } from 'lucide-react';

export default function Dev() {
  const [key, setKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useDevAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dev/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!key.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira a chave de acesso.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('validate-dev-key', {
        body: { key },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Chave inválida');
      }

      login(data.token);
      toast({
        title: 'Bem-vindo!',
        description: 'Acesso autorizado ao portal de desenvolvimento.',
      });
      navigate('/dev/dashboard');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao validar chave';
      toast({
        title: 'Acesso negado',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Code className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Portal de Desenvolvimento</CardTitle>
          <CardDescription>
            Insira a chave de acesso para gerenciar o portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key">Chave de Acesso</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="key"
                  type="password"
                  placeholder="Digite sua chave secreta"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

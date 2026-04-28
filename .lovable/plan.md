## Carregar Projects e Skills dinamicamente do banco

### Objetivo
Substituir os arrays fixos em `Projects.tsx` e `Skills.tsx` por dados das tabelas `projects` e `skills`, com loading, estado vazio e atualização em tempo real após edições no `/dev`.

### 1. Hook `src/hooks/usePortfolioData.ts` (novo)
- `useProjects()` → `supabase.from('projects').select('*').order('order_index').order('created_at', { ascending: false })`
- `useSkills()` → mesma lógica para `skills`
- Cada hook retorna `{ data, loading, error }`
- Inscreve canal realtime em `postgres_changes` da respectiva tabela e refaz o fetch quando há mudança; cleanup no unmount

### 2. `src/components/Projects.tsx`
- Remover array hardcoded e imports de imagens locais
- Consumir `useProjects()`
- Loading: 4 skeletons no mesmo grid
- Vazio: mensagem discreta "Nenhum projeto disponível ainda"
- Dados: usa `image_url` (fallback `/placeholder.svg`), `title`, `description`, `tags`, `live_url`, `github_url`
- Esconder ícones de Github/Link quando a URL for nula

### 3. `src/components/Skills.tsx`
- Remover array hardcoded
- Consumir `useSkills()`
- Mapear campo `icon` (string) para componente lucide via lookup: `Code`, `Palette`, `Layout`, `Bot`, `Zap`, `Workflow`, `Database`, `Globe`, `Smartphone` (fallback `Code`)
- Loading: 6 skeletons; Vazio: mensagem discreta
- Renderizar `title`, `description`, barra com `level%`
- Seção "Ferramentas que utilizo" permanece estática

### Arquivos
| Arquivo | Ação |
|---|---|
| `src/hooks/usePortfolioData.ts` | criar |
| `src/components/Projects.tsx` | reescrever |
| `src/components/Skills.tsx` | reescrever |

### Sem alterações
Banco, RLS, edge functions, rotas e design visual permanecem iguais. Leitura pública já está habilitada nas duas tabelas.



## Portal de Desenvolvedor - Sistema de Edição Protegido por Chave

### Objetivo
Criar um portal de administrador onde apenas quem possui a chave de acesso pode editar projetos, skills, informacoes pessoais e outras funcionalidades do portfolio.

---

## Arquitetura do Sistema

```text
+------------------+     +-------------------+     +------------------+
|   Pagina Dev     |---->|   Validacao de    |---->|   Dashboard      |
|   (/dev)         |     |   Chave de Acesso |     |   Admin          |
+------------------+     +-------------------+     +------------------+
                                                           |
                                  +------------------------+------------------------+
                                  |                        |                        |
                           +------v------+          +------v------+          +------v------+
                           |   Editar    |          |   Editar    |          |   Editar    |
                           |   Projetos  |          |   Skills    |          |   Perfil    |
                           +-------------+          +-------------+          +-------------+
```

---

## Componentes a Criar

### 1. Tabelas no Banco de Dados

| Tabela | Campos | Descricao |
|--------|--------|-----------|
| `projects` | id, title, description, tags, image_url, live_url, github_url, order_index, created_at, updated_at | Armazena projetos editaveis |
| `skills` | id, title, description, icon, level, created_at, updated_at | Armazena skills editaveis |
| `profile_settings` | id, name, title, bio, years_experience, projects_delivered, email, github_url, linkedin_url, location, available_for_work, updated_at | Configuracoes do perfil |
| `site_settings` | id, key, value, updated_at | Configuracoes gerais do site |

### 2. Novas Paginas

| Pagina | Rota | Funcao |
|--------|------|--------|
| DevLogin | `/dev` | Formulario de entrada da chave de acesso |
| DevDashboard | `/dev/dashboard` | Painel principal com opcoes de edicao |
| DevProjects | `/dev/projects` | Lista e edicao de projetos |
| DevSkills | `/dev/skills` | Lista e edicao de skills |
| DevProfile | `/dev/profile` | Edicao do perfil e informacoes pessoais |
| DevSettings | `/dev/settings` | Configuracoes gerais do site |

### 3. Sistema de Autenticacao com Chave

**Metodo de Seguranca:**
- Chave armazenada como secret no backend (nao exposta no frontend)
- Edge Function para validar a chave inserida
- Token JWT gerado apos validacao, armazenado em sessionStorage
- Todas as operacoes de edicao passam pela validacao do token

---

## Fluxo de Autenticacao

1. Usuario acessa `/dev`
2. Insere a chave de acesso
3. Frontend envia chave para Edge Function `validate-dev-key`
4. Edge Function compara com secret `DEV_ACCESS_KEY`
5. Se valido, retorna token JWT temporario (24h)
6. Frontend armazena token e redireciona para dashboard
7. Todas as operacoes CRUD verificam o token

---

## Secao Tecnica

### Edge Functions a Criar

| Funcao | Endpoint | Descricao |
|--------|----------|-----------|
| `validate-dev-key` | POST | Valida a chave e retorna JWT |
| (RLS) | - | As operacoes CRUD serao feitas via Supabase client com RLS |

### Politicas RLS

As tabelas terao RLS habilitado com:
- **SELECT**: Publico (para o portfolio exibir os dados)
- **INSERT/UPDATE/DELETE**: Apenas via service_role (Edge Function)

### Estrutura de Ficheiros

```text
src/
├── pages/
│   ├── Dev.tsx              # Login com chave
│   ├── DevDashboard.tsx     # Painel principal
│   ├── DevProjects.tsx      # Gerenciar projetos
│   ├── DevSkills.tsx        # Gerenciar skills
│   ├── DevProfile.tsx       # Gerenciar perfil
│   └── DevSettings.tsx      # Configuracoes
├── components/
│   ├── dev/
│   │   ├── DevHeader.tsx    # Header do painel admin
│   │   ├── DevSidebar.tsx   # Menu lateral
│   │   ├── ProjectForm.tsx  # Formulario de projeto
│   │   ├── SkillForm.tsx    # Formulario de skill
│   │   └── ProfileForm.tsx  # Formulario de perfil
│   └── ...
├── hooks/
│   └── useDevAuth.ts        # Hook de autenticacao dev
└── contexts/
    └── DevAuthContext.tsx   # Contexto de autenticacao
supabase/
└── functions/
    └── validate-dev-key/
        └── index.ts         # Validacao da chave
```

### Migracao SQL

```sql
-- Tabela de Projetos
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Skills
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'Code',
  level INTEGER DEFAULT 50 CHECK (level >= 0 AND level <= 100),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Configuracoes do Perfil
CREATE TABLE public.profile_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Elves Guilande',
  title TEXT DEFAULT 'Desenvolvedor Web',
  bio TEXT,
  years_experience INTEGER DEFAULT 3,
  projects_delivered INTEGER DEFAULT 20,
  email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  location TEXT DEFAULT 'Brasil',
  available_for_work BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

-- Politicas: Leitura publica
CREATE POLICY "Public read access" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.profile_settings FOR SELECT USING (true);
```

---

## Resumo das Alteracoes

| Tipo | Quantidade |
|------|------------|
| Tabelas no BD | 3 |
| Edge Functions | 1 |
| Novas Paginas | 6 |
| Novos Componentes | 6+ |
| Hooks | 1 |
| Contextos | 1 |

---

## Secret Necessario

Sera necessario adicionar um novo secret:

| Nome | Descricao |
|------|-----------|
| `DEV_ACCESS_KEY` | Chave de acesso ao portal de desenvolvimento (voce define a chave) |

---

## Seguranca

- A chave nunca e exposta no frontend
- Validacao acontece apenas no servidor (Edge Function)
- Token JWT com expiracao de 24 horas
- RLS impede modificacoes diretas no banco
- Operacoes de escrita passam pela Edge Function com service_role




## Plano: Funcionalidades Avancadas do Portal Dev

### 1. Upload de Imagens para Projetos

**Objetivo:** Adicionar opcao de fazer upload de imagens do dispositivo alem da URL

**Implementacao:**

1. **Criar Storage Bucket** (Migracao SQL):
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Politica de leitura publica
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'project-images');

-- Politica de upload (apenas via service role)
CREATE POLICY "Service role upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'project-images');
```

2. **Nova Edge Function `upload-image`:**
   - Recebe imagem em base64 ou FormData
   - Valida token do desenvolvedor
   - Faz upload para o bucket usando service_role
   - Retorna URL publica da imagem

3. **Atualizar ProjectForm.tsx:**
   - Adicionar tabs: "URL" | "Upload"
   - Componente de upload com drag-and-drop
   - Preview da imagem selecionada
   - Botao para enviar e obter URL

---

### 2. Geracao Automatica de Descricao

**Objetivo:** Quando URL do projeto e adicionada, analisar o site e gerar descricao automaticamente

**Implementacao:**

1. **Nova Edge Function `analyze-project`:**
   - Recebe URL do projeto
   - Usa Firecrawl para scrape do site (obter titulo, descricao, conteudo)
   - Usa Lovable AI (gemini-2.5-flash) para gerar descricao
   - Retorna descricao gerada

2. **Atualizar ProjectForm.tsx:**
   - Botao "Gerar Descricao" ao lado do campo URL do Projeto
   - Quando clicado, chama a Edge Function
   - Preenche o campo descricao automaticamente
   - Usuario pode editar livremente apos geracao

**Fluxo:**
```
Usuario insere URL -> Clica "Gerar" -> Edge Function:
  1. Scrape do site (Firecrawl)
  2. Analise com IA (Lovable AI)
  3. Retorna descricao
-> Preenche campo descricao (editavel)
```

---

### 3. Acesso Discreto ao /dev (Gesto Secreto)

**Objetivo:** Arrastar foto de perfil para cima para aceder ao portal de desenvolvimento

**Implementacao:**

1. **Atualizar Hero.tsx:**
   - Adicionar eventos de touch/mouse na foto de perfil
   - Detectar gesto de arrastar para cima (swipe up) sem soltar
   - Threshold: arrastar pelo menos 100px para cima
   - Feedback visual sutil (leve brilho ou opacidade)

2. **Logica do gesto:**
```typescript
// Eventos a implementar:
- onMouseDown / onTouchStart: Iniciar tracking
- onMouseMove / onTouchMove: Calcular distancia vertical
- onMouseUp / onTouchEnd: Se distancia > 100px para cima, navegar para /dev

// Discreto:
- Sem indicacao visual de que existe o gesto
- Feedback apenas durante o arrastar (sutil)
```

3. **Hook personalizado `useSecretGesture`:**
   - Encapsula logica de detecao do gesto
   - Retorna ref para o elemento
   - Callback para acao quando gesto completo

---

## Arquivos a Criar/Modificar

| Arquivo | Acao |
|---------|------|
| `supabase/migrations/xxx.sql` | Criar bucket storage |
| `supabase/functions/upload-image/index.ts` | Upload de imagens |
| `supabase/functions/analyze-project/index.ts` | Scrape + IA para descricao |
| `src/components/dev/ProjectForm.tsx` | Adicionar upload + botao gerar descricao |
| `src/components/dev/ImageUpload.tsx` | Componente de upload |
| `src/components/Hero.tsx` | Adicionar gesto secreto |
| `src/hooks/useSecretGesture.ts` | Hook para detecao do gesto |

---

## Dependencias

- **Firecrawl Connector**: Necessario para scrape de sites
  - Sera usado na Edge Function `analyze-project`
  - Precisa estar configurado (verificar se ja existe)

- **Lovable AI**: Disponivel nativamente
  - Modelo: `google/gemini-2.5-flash` (rapido e eficiente)
  - Sem necessidade de API key adicional

---

## Secao Tecnica

### Edge Function: analyze-project

```typescript
// 1. Receber URL
const { url } = await req.json();

// 2. Scrape com Firecrawl
const scrapeResult = await fetch('https://api.firecrawl.dev/v1/scrape', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${FIRECRAWL_API_KEY}` },
  body: JSON.stringify({ url, formats: ['markdown', 'html'] })
});

// 3. Enviar para Lovable AI
const aiResponse = await fetch('https://lovable.dev/api/ai', {
  method: 'POST',
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [{
      role: 'user',
      content: `Analise este site e gere uma descricao profissional de 2-3 frases para um portfolio: ${scrapeResult.markdown}`
    }]
  })
});

// 4. Retornar descricao
return { description: aiResponse.text };
```

### Hook: useSecretGesture

```typescript
function useSecretGesture(onActivate: () => void) {
  const ref = useRef<HTMLElement>(null);
  const [startY, setStartY] = useState<number | null>(null);
  
  // Detectar inicio do gesto
  const handleStart = (y: number) => setStartY(y);
  
  // Calcular movimento
  const handleMove = (y: number) => {
    if (startY && startY - y > 100) {
      // Arrastar para cima mais de 100px
      onActivate();
    }
  };
  
  return { ref, handlers };
}
```

---

## Seguranca

- Upload de imagens passa pela Edge Function (validacao de token)
- Firecrawl API key protegida no backend
- Gesto secreto nao expoe nenhuma informacao sensivel
- RLS continua protegendo os dados


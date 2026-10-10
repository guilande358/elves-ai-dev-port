const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-dev-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

const gh = (path: string) =>
  fetch(`https://api.github.com/${path}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-analyzer' },
  });

async function ghText(owner: string, repo: string, file: string): Promise<string> {
  const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file}`, {
    headers: { Accept: 'application/vnd.github.raw', 'User-Agent': 'portfolio-analyzer' },
  });
  return r.ok ? await r.text() : '';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    if (!req.headers.get('x-dev-token')) return json({ success: false, error: 'Token de desenvolvedor não fornecido' }, 401);
    const body = await req.json().catch(() => ({}));

    // List repos of a user
    if (body.action === 'list') {
      const username = String(body.username || '').trim();
      if (!/^[A-Za-z0-9-]{1,39}$/.test(username)) return json({ success: false, error: 'Usuário GitHub inválido' }, 400);
      const r = await gh(`users/${username}/repos?sort=updated&per_page=100`);
      if (!r.ok) return json({ success: false, error: `GitHub retornou ${r.status}` }, r.status);
      const repos = (await r.json()).filter((x: any) => !x.fork).map((x: any) => ({
        name: x.name, full_name: x.full_name, html_url: x.html_url,
        description: x.description, homepage: x.homepage, language: x.language,
      }));
      return json({ success: true, repos });
    }

    // Analyze a repo
    const m = String(body.repoUrl || '').trim().match(/github\.com\/([^/\s]+)\/([^/\s#?]+)/i);
    if (!m) return json({ success: false, error: 'URL do repositório GitHub inválida' }, 400);
    const owner = m[1], repo = m[2].replace(/\.git$/, '');

    const repoRes = await gh(`repos/${owner}/${repo}`);
    if (!repoRes.ok) return json({ success: false, error: `Repositório não encontrado (${repoRes.status})` }, repoRes.status);
    const info = await repoRes.json();
    const [readme, pkg, langsRes, indexHtml] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers: { Accept: 'application/vnd.github.raw', 'User-Agent': 'portfolio-analyzer' } }).then(r => r.ok ? r.text() : ''),
      ghText(owner, repo, 'package.json'),
      gh(`repos/${owner}/${repo}/languages`),
      ghText(owner, repo, 'index.html'),
    ]);
    const languages = langsRes.ok ? Object.keys(await langsRes.json()) : [];
    let deps: string[] = [];
    try { const p = JSON.parse(pkg); deps = Object.keys({ ...(p.dependencies || {}), ...(p.devDependencies || {}) }); } catch { /* none */ }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) return json({ success: false, error: 'IA não configurada' }, 500);

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
      method: 'POST',
      headers: { 'Lovable-API-Key': lovableApiKey, Authorization: `Bearer ${lovableApiKey}`, 'X-Lovable-AIG-SDK': 'fetch', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-6-astra',
        stream: true,
        store: false,
        reasoning: { effort: 'low' },
        instructions: 'Você cria entradas de portfólio de desenvolvedor. description: 2-3 frases profissionais em português. tags: 3-8 tecnologias principais com nomes legíveis (ex: "React", "Tailwind CSS", "Supabase"). live_url: URL de deploy encontrada no README/homepage/index.html, ou null.',
        input: `Repositório: ${info.full_name}\nDescrição GitHub: ${info.description || '-'}\nHomepage: ${info.homepage || '-'}\nTopics: ${(info.topics || []).join(', ')}\nLinguagens: ${languages.join(', ')}\nDependências: ${deps.slice(0, 60).join(', ')}\n\nindex.html (início):\n${indexHtml.slice(0, 1200)}\n\nREADME:\n${readme.slice(0, 4000)}`,
        text: { format: { type: 'json_schema', name: 'project', strict: true, schema: {
          type: 'object', additionalProperties: false, required: ['title', 'description', 'tags', 'live_url'],
          properties: { title: { type: 'string' }, description: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, live_url: { type: ['string', 'null'] } },
        } } },
      }),
    });
    if (!aiRes.ok || !aiRes.body) {
      const t = await aiRes.text();
      console.error('AI error', aiRes.status, t);
      let safe = '';
      try { safe = JSON.parse(t).error?.message || JSON.parse(t).message || ''; } catch { /* ignore */ }
      const msg = aiRes.status === 429 ? 'Limite de requisições excedido. Tente mais tarde.' : aiRes.status === 402 ? 'Créditos de IA esgotados.' : (safe || 'Erro ao gerar com IA');
      return json({ success: false, error: msg }, aiRes.status);
    }
    let out = '';
    const reader = aiRes.body.pipeThrough(new TextDecoderStream()).getReader();
    let buf = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += value;
      const lines = buf.split('\n'); buf = lines.pop() || '';
      for (const l of lines) {
        if (!l.startsWith('data:')) continue;
        try { const ev = JSON.parse(l.slice(5).trim()); if (ev.type === 'response.output_text.delta') out += ev.delta; } catch { /* skip */ }
      }
    }
    let parsed: any = {};
    try { parsed = JSON.parse(out); } catch { return json({ success: false, error: 'Resposta da IA inválida' }, 500); }

    const liveUrl = info.homepage || parsed.live_url || null;

    // --- Real icon + public routes from the repository code ---
    const branch = info.default_branch || 'main';
    const raw = (p: string) => `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${p}`;
    let paths: string[] = [];
    try {
      const t = await gh(`repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
      if (t.ok) paths = ((await t.json()).tree || []).filter((x: any) => x.type === 'blob').map((x: any) => x.path);
    } catch { /* ignore */ }

    let iconUrl: string | null = null;
    const linkIcon = indexHtml.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*>/i)?.[0].match(/href=["']([^"']+)["']/i)?.[1];
    if (linkIcon) {
      if (/^https?:\/\//.test(linkIcon)) iconUrl = linkIcon;
      else { const c = linkIcon.replace(/^\.?\//, ''); const hit = paths.find((p) => p === `public/${c}` || p === c); if (hit) iconUrl = raw(hit); }
    }
    if (!iconUrl) {
      const prefs = ['apple-touch-icon.png', 'icon-512.png', 'icon.svg', 'logo.svg', 'favicon.svg', 'icon.png', 'logo.png', 'favicon.png', 'favicon.ico'];
      for (const n of prefs) { const hit = paths.find((p) => /^(public\/|src\/assets\/|static\/)?/.test(p) && p.toLowerCase().endsWith('/' + n) || p.toLowerCase() === n); if (hit) { iconUrl = raw(hit); break; } }
    }

    // Detect routes declared in the code (React Router etc.) and screenshot public ones
    const routeFiles = paths.filter((p) => /^src\/(App|main|routes|router)[^/]*\.(t|j)sx?$/.test(p)).slice(0, 3);
    const routeSrc = (await Promise.all(routeFiles.map((f) => ghText(owner, repo, f)))).join('\n');
    const routes = new Set<string>(['/']);
    for (const mm of routeSrc.matchAll(/path\s*[:=]\s*\{?\s*["'`](\/[^"'`]*)["'`]/g)) {
      const r = mm[1];
      if (r.includes(':') || r.includes('*') || /dashboard|admin|account|settings|profile|perfil|painel|conta/i.test(r)) continue;
      routes.add(r);
    }
    const screenshots = liveUrl
      ? [...routes].slice(0, 6).map((r) => `https://image.thum.io/get/width/1200/crop/750/${liveUrl.replace(/\/$/, '')}${r === '/' ? '' : r}`)
      : [];
    const imageUrl = iconUrl || screenshots[0] || null;

    return json({
      success: true,
      title: parsed.title || info.name,
      description: parsed.description || info.description || '',
      tags: Array.isArray(parsed.tags) ? parsed.tags : languages,
      live_url: liveUrl,
      github_url: info.html_url,
      image_url: imageUrl,
      icon_url: iconUrl,
      screenshots,
    });
  } catch (e) {
    console.error('analyze-github error', e);
    return json({ success: false, error: e instanceof Error ? e.message : 'Erro desconhecido' }, 500);
  }
});

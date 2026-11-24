# LogArt — prévia navegável

Prévia do front-end do LogArt para apresentação ao cliente: 47 telas (painel, app do motorista, páginas do cliente final e design system), clicáveis, com **dados fictícios em memória**. Não há backend, login real nem gravação. Recarregar a página reinicia o estado.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000
```

## Publicar na Vercel

1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel: **Add New → Project**, importe o repositório. O framework (Next.js) é detectado sozinho; não precisa de variáveis de ambiente.
3. **Deploy.** Para a prévia não aparecer em buscadores já há `noindex`; para restringir o acesso, ative *Deployment Protection → Password Protection* no projeto (plano Pro) ou compartilhe só o link.

Alternativa sem GitHub: `npx vercel` dentro da pasta.

## Como funciona

As telas vêm do canvas de design (artefato "LogArt — Design System"). `tools/convert.py` converte cada prancheta `.dc.html` em um módulo em `src/screens/` (HTML + lógica de estado); `src/lib/render.ts` interpreta os `{{campos}}`, `<sc-for>` e `<sc-if>` e `src/components/ScreenRunner.tsx` desenha e liga os cliques.

- `/` — mapa de telas, com os três pedidos do cliente em destaque
- `/t/<tela>` — cada tela (ex.: `/t/etiquetas`, `/t/mot-leitura`, `/t/rastreio`)

Para atualizar depois de mudar o canvas: `python3 tools/convert.py <pasta project do canvas>` e novo deploy. Os arquivos em `src/screens/` são gerados; não edite à mão.

## O que esta prévia ainda não é

É uma prévia de design interativa, não o produto. Os componentes não são shadcn/React por tela; ao construir o sistema real, cada tela vira componentes React ligados ao Supabase (modelo de dados v0.4).

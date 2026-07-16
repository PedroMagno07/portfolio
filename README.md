# Portfólio — Pedro Magno

Portfólio pessoal de **Pedro Magno** — Estagiário de Inovação, atuando com automação,
análise de dados e agentes de IA. Site estático, sem framework e sem etapa de build:
apenas HTML, CSS e JavaScript.

🔗 **Contato:** [LinkedIn](https://www.linkedin.com/in/pedro-magno07) · [GitHub](https://github.com/PedroMagno07)

## Funcionalidades

- **Dark mode** como padrão, com paleta pensada primeiro para o modo escuro
- **Bilíngue (PT/EN)** — troca de idioma instantânea, sem recarregar a página
- **Scroll reveal** e microinterações em todos os elementos interativos
- **Partículas conectadas** em canvas no hero, com parallax leve
- **Cursor customizado** que reage aos cards de projeto (desktop)
- **Navegação fixa** em glassmorphism, com indicação da seção ativa
- **Responsivo** (mobile, tablet, desktop) e acessível — respeita `prefers-reduced-motion`,
  navegação por teclado e contraste WCAG AA

## Stack

HTML5 · CSS3 (custom properties, grid, flexbox) · JavaScript (ES5+, sem dependências) ·
Canvas API · IntersectionObserver

Sem build, sem bundler, sem dependências — o site roda direto do sistema de arquivos.

## Estrutura

```
index.html      — conteúdo e marcação (PT como fallback)
css/style.css   — design tokens e estilos (dark-first)
js/i18n.js      — dicionário PT/EN (todo o texto do site vive aqui)
js/main.js      — i18n, scroll reveal, nav ativa, canvas do hero, cursor, menu mobile
assets/         — currículo em PDF servido pelo botão de download
render.yaml     — blueprint de deploy no Render
```

## Rodar localmente

Qualquer servidor estático serve:

```bash
python -m http.server 8087
```

Abra <http://localhost:8087>. Abrir o `index.html` direto via `file://` também funciona,
mas servir por HTTP reproduz melhor o comportamento de produção.

## Deploy

O site é 100% estático e pode ser publicado em qualquer host de arquivos estáticos.

**Render** (via `render.yaml`): conecte o repositório e o blueprint é detectado
automaticamente. Para configurar manualmente: *New > Static Site*, deixando o
**Build Command** em branco e o **Publish Directory** como `.`.

Netlify, Vercel, Cloudflare Pages e GitHub Pages funcionam do mesmo modo — basta
apontar para a raiz do repositório.

## Manutenção

**Textos:** todo o conteúdo textual passa pelo dicionário em `js/i18n.js`, nas chaves
`pt` e `en`. Editar lá atualiza os dois idiomas — o HTML carrega apenas o fallback em PT.

**Currículo:** o botão de download serve `assets/Pedro-Magno-CV.pdf`. Para atualizar,
substitua o arquivo mantendo o nome.

**Cache:** os links de `css/style.css` e `js/*.js` no `index.html` usam o sufixo `?v=N`.
Ao alterar CSS ou JS, incremente esse número para que os navegadores baixem a versão
nova em vez de servir a antiga do cache.

## Licença

[MIT](LICENSE) — o código é livre para uso e adaptação. O conteúdo pessoal
(textos, currículo e informações de contato) não está incluído nessa permissão.

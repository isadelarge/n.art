# N.ART Móveis · Marcenaria de Planejados

Catálogo de projetos por ambiente, com orçamento pelo WhatsApp em cada card. HTML, CSS e JavaScript puros, sem build.

## Páginas

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Site completo: abertura, projetos, história, atendimento, avaliações e contato |
| `projetos.html` | Só o catálogo, para enviar ao cliente |

## Como o proprietário usa

Em qualquer uma das páginas, escolha a categoria e toque em **Enviar link**. O link enviado abre sempre a `projetos.html`. No celular abre a janela de compartilhar (WhatsApp incluso); no computador o link é copiado. O cliente abre direto naquele ambiente, sem a página inicial.

| Link | O que abre |
| --- | --- |
| `projetos.html?ambiente=cozinhas` | Só as cozinhas (`paineis-salas`, `corporativo`, e `closets-quartos` e `banheiros` quando tiverem fotos) |
| `projetos.html?foto=COZ-01` | O projeto COZ-01 em tela cheia |

O botão de cada card abre o WhatsApp (43) 99699-8786 com a mensagem pronta do modelo e o link da foto.

## Fotos e projetos

As fotos ficam em `assets/fotos/<categoria>/`. Em `assets/data.js`, cada projeto tem `photos` (nome do arquivo com extensão, a primeira é a capa), `title`, `details` e, se quiser, `cta` e `msg`. Categoria sem projetos fica escondida, como Closets & Quartos e Banheiros hoje.

## Fotos novas

Depois de colocar fotos em `assets/fotos/<categoria>/`, rode na pasta do projeto:

```bash
python tools/otimizar-fotos.py
```

O script cria versões de 480, 640, 800 e 1200 px em WebP, que o site usa para carregar rápido no celular. A foto original continua na tela cheia.

## Desempenho

Nota 100 no PageSpeed Insights (desempenho, acessibilidade, boas práticas e SEO), no celular e no computador. A fonte Jost é servida pelo próprio site (`assets/fonts`), com uma fonte de reserva ajustada para o texto não pular ao carregar. O `vercel.json` define o cache dos arquivos.

## Identidade

Cores tiradas da logo (preto, grafite e cinza claro) e fonte Jost. O símbolo do N foi redesenhado em vetor e está no `index.html` (símbolo `#nart`), em `assets/logo.svg` e em `assets/favicon.svg`. A logo original está em `assets/brand/logo-original.webp`.

## Rodar localmente

```bash
python -m http.server 4333
```

## Antes de ir ao ar

O `og:url` e o `og:image` do `index.html` apontam para `https://n-art-moveis.vercel.app/`. Troque pelo endereço real depois de publicar, senão a prévia do link no WhatsApp sai sem foto. Ao atualizar CSS ou JS, aumente o `?v=` nos links do `index.html`.

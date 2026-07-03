# Content Guide

> **Also available in:** [Português (ver abaixo)](#português-1)

How to add new poems or projects to the site without touching code.

## Adding a Poem

1. Copy `content/_templates/poem.mdx`.
2. Paste it into `content/poems/` with a new filename (use `-` between words, no special characters, ex: `name-of-poem.mdx`).
3. Fill in the fields at the top of the file (between the `---` lines):
   - `title`: the poem's title
   - `slug`: must match the filename, without `.mdx`
   - `date`: in format YYYY-MM-DD
   - `excerpt`: short phrase that appears in listings
   - `category`: one of the existing categories in `content/categories.yaml` (sombras, luz, ilustracao, manuscrito)
   - `tags`: list of keywords
   - `featured`: `true` to highlight on the home page
   - `published`: `false` while drafting, `true` to publish
   - `coverImage`: path to the cover image (upload the image to `public/images/poems/`)
4. Write the poem below the second `---` line.
5. Save, commit, and push to GitHub. The site updates automatically within a few minutes.

## Adding a Portfolio Project

Same process, using `content/_templates/project.mdx` and saving to `content/projects/`.

## Editing General Site Text

- Home page text: `content/pages/home.yaml`
- About page text: `content/pages/about.mdx`
- Site name, navigation menu, social links, featured quote (home page quote): `content/settings.yaml`
- Category list: `content/categories.yaml`

## What NOT to Edit

Nothing inside `/app`, `/components`, or `/lib` — these are code files. Only edit files inside `/content`.

---

# Português

## Guia de Conteúdo

Como adicionar um novo poema ou projeto ao site, sem precisar mexer em código.

## Adicionar um poema

1. Copie `content/_templates/poem.mdx`.
2. Cole em `content/poems/` com um novo nome de arquivo (use `-` entre palavras, sem acentos, ex: `nome-do-poema.mdx`).
3. Preencha os campos no topo do arquivo (entre `---`):
   - `title`: título do poema
   - `slug`: precisa ser igual ao nome do arquivo, sem `.mdx`
   - `date`: no formato AAAA-MM-DD
   - `excerpt`: frase curta que aparece nas listagens
   - `category`: uma das categorias existentes em `content/categories.yaml` (sombras, luz, ilustracao, manuscrito)
   - `tags`: lista de palavras-chave
   - `featured`: `true` para destacar na página inicial
   - `published`: `false` enquanto for rascunho, `true` para publicar
   - `coverImage`: caminho da imagem de capa (envie a imagem para `public/images/poems/`)
4. Escreva o poema abaixo da segunda linha `---`.
5. Salve, faça commit e envie (push) para o GitHub. O site é atualizado automaticamente em alguns minutos.

## Adicionar um projeto de portfólio

Mesmo processo, usando `content/_templates/project.mdx` e salvando em `content/projects/`.

## Editar textos gerais do site

- Textos da página inicial: `content/pages/home.yaml`
- Texto da página Sobre: `content/pages/about.mdx`
- Nome do site, menu de navegação, redes sociais, frase de destaque (citação da página inicial): `content/settings.yaml`
- Lista de categorias: `content/categories.yaml`

## O que NÃO editar

Nada dentro de `/app`, `/components`, ou `/lib` — esses são arquivos de código. Editar apenas o que estiver dentro de `/content`.

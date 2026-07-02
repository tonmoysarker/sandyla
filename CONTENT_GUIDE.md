# Guia de Conteúdo

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
- Nome do site, menu de navegação, redes sociais, frase do rodapé: `content/settings.yaml`
- Lista de categorias: `content/categories.yaml`

## O que NÃO editar

Nada dentro de `/app`, `/components`, ou `/lib` — esses são arquivos de código. Editar apenas o que estiver dentro de `/content`.

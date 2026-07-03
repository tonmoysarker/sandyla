# Getting Started — Content Editor's Guide

> **Também disponível em:** [Português (ver abaixo)](#português)

This guide is for anyone **without coding experience** who wants to edit poems, projects, or site text. You don't need to install anything — everything works directly in your browser.

## Step 1: Create a GitHub Account

1. Open https://github.com/signup
2. Fill in:
   - **Username:** your GitHub username (can be anything, ex: `tonmoy98`)
   - **Email:** your email address
   - **Password:** a secure password
3. Click **Create account** and follow the instructions (including email verification)

Done! You now have a GitHub account.

## Step 2: Access the Repository

1. Open https://github.com/tonmoysarker/sandyla
   (or ask Tonmoy for the exact repository link)

2. You'll see a page with folders and files. This is the "home" for all site content.

3. **Don't worry!** Most of these files are code. You'll only edit files in the `/content` folder.

## Step 3: Understand the Structure (What to Edit, What to Avoid)

**Folders where you CAN edit:**

```
content/
├── poems/           ← Poems
├── projects/        ← Portfolio projects
├── pages/           ← General site text (about, home, etc)
├── categories.yaml  ← List of categories
└── settings.yaml    ← Site name, menu, social links
```

**Folders where you MUST NOT edit:**

- `/app`, `/components`, `/lib` — these are site code
- `.github/`, `docs/`, `node_modules/` — system configuration

## Step 4: Edit a File

To **add a poem, project** or **edit text**:

1. Navigate to the correct folder (ex: `/content/poems`)
2. Click the file you want to edit (or click the `+` icon to create a new one)
3. You'll see the content on screen. Click the pencil icon (✏️) in the top right corner to edit
4. Make your changes
5. Scroll down to the "Commit changes" section (usually at the bottom)
6. Leave the default message or write what you changed in a few words
7. Click **Commit changes** (green button)

**Done!** Your file is saved. The site updates automatically in a few minutes (Vercel does this automatically).

## Step 5: Create a New File

If you want to add a **new poem** or **new project**:

1. Open the `/content/poems` (or `/content/projects`) folder
2. Click **Add file** → **Create new file**
3. In the **Name your file** box, type the name (ex: `my-poem.mdx`)
   - Use lowercase letters
   - Use hyphens (`-`) to separate words, never spaces
   - End with `.mdx`
4. Copy the content from a template file:
   - For a poem: open `content/_templates/poem.mdx`, copy everything
   - For a project: open `content/_templates/project.mdx`, copy everything
5. Paste the template into your new file
6. Fill in the fields (follow the **Content Guide** to know what goes in each field)
7. Scroll down, click **Commit changes**

## Step 6: Upload an Image

If your poem or project has a cover image:

1. Open the `/public/images/poems` (or `/public/images/projects`) folder
2. Click **Add file** → **Upload files**
3. Select the image from your computer
4. Click **Commit changes**
5. **Copy the filename** (ex: `red-rose.jpg`)
6. Open your poem/project and put that filename in the `coverImage` field
   - Ex: `coverImage: /images/poems/red-rose.jpg`

## How Does the Site Update?

- When you click **Commit changes**, GitHub saves the change
- A robot (Vercel) detects the change and **rebuilds the site** automatically
- In 1-5 minutes, your changes appear live on the site

You don't need to do anything else — it's automatic!

## If You Made a Mistake

Don't worry, it's easy to undo:

1. Open the file you edited
2. Click the history (GitHub has a **History** button or ⏱️ icon)
3. Look for the earlier version (GitHub keeps everything)
4. Click **Revert this commit** or manually copy the older version

## Next Steps

After creating your account and understanding this basic navigation, read the **Content Guide** (`CONTENT_GUIDE.md`) to learn:
- Which fields to fill in each file
- The correct format for dates, categories, tags, etc.
- How to edit home page text, About page, and general settings

## Frequently Asked Questions

**Q: Do I need to know how to code?**
A: No! GitHub provides a visual editor that works like a simple text editor. You just write and save.

**Q: Can I break something?**
A: You can only edit files inside `/content`. The code folder (`/app`, `/components`) is protected — GitHub will warn you if you try to edit there. And there's always history to undo changes.

**Q: How long does it take for changes to appear on the site?**
A: 1-5 minutes, usually. Refresh your browser (F5) if you don't see the change right away.

**Q: How do I insert an image in the poem?**
A: In the `.mdx` file, you can use:
```markdown
![Image description](/images/poems/image-name.jpg)
```

**Q: Can I use special formatting (bold, italic)?**
A: Yes! Use:
- `**bold text**`
- `*italic text*`
- `[link](https://example.com)`

Good luck! 📝

---

# Português

## Como Começar — Guia para Editar Conteúdo

Este guia é para quem **não sabe programar** e quer editar poemas, projetos ou textos do site. Você não precisa instalar nada na sua máquina — tudo funciona direto no navegador.

## Passo 1: Criar uma conta GitHub

1. Abra https://github.com/signup
2. Preencha com:
   - **Username:** seu nome de usuário (pode ser qualquer coisa, ex: `tonmoy98`)
   - **Email:** seu e-mail
   - **Password:** uma senha segura
3. Clique **Create account** e siga as instruções (incluindo verificação de e-mail)

Pronto! Você agora tem uma conta GitHub.

## Passo 2: Acessar o repositório

1. Abra https://github.com/tonmoysarker/sandyla
   (ou peça ao Tonmoy o link exato do repositório)

2. Você verá uma página com pastas e arquivos. Essa é a "casa" de todo conteúdo do site.

3. **Não se assuste!** A maioria desses arquivos é código. Você vai mexer **apenas** na pasta `/content`.

## Passo 3: Entender a estrutura (o que mexer, o que não mexer)

**Pastas onde você PODE editar:**

```
content/
├── poems/           ← Poemas
├── projects/        ← Projetos de portfólio
├── pages/           ← Textos gerais (sobre, home, etc)
├── categories.yaml  ← Lista de categorias
└── settings.yaml    ← Nome, menu, redes sociais
```

**Pastas onde você NÃO deve mexer:**

- `/app`, `/components`, `/lib` — essas são código do site
- `.github/`, `docs/`, `node_modules/` — configuração do sistema

## Passo 4: Editar um arquivo

Para **adicionar um poema, projeto** ou **editar um texto**:

1. Navegue até a pasta certa (ex: `/content/poems`)
2. Clique no arquivo que quer editar (ou clique no ícone `+` para criar um novo)
3. Você verá o conteúdo na tela. Clique no ícone de lápis (✏️) no canto superior direito para editar
4. Faça suas alterações
5. Desça até a seção "Commit changes" (geralmente no final da página)
6. Deixe a mensagem padrão ou escreva o que mudou em poucas palavras
7. Clique **Commit changes** (botão verde)

**Pronto!** Seu arquivo foi salvo. O site atualiza sozinho em poucos minutos (Vercel faz isso automaticamente).

## Passo 5: Criar um novo arquivo

Se quer adicionar um **novo poema** ou **novo projeto**:

1. Abra a pasta `/content/poems` (ou `/content/projects`)
2. Clique no botão **Add file** → **Create new file**
3. Na caixa **Name your file**, digite o nome (ex: `meu-poema.mdx`)
   - Use letras minúsculas
   - Use hífens (`-`) para separar palavras, nunca espaços
   - Termine com `.mdx`
4. Copie o conteúdo de um arquivo de modelo:
   - Para poema: abra `content/_templates/poem.mdx`, copie tudo
   - Para projeto: abra `content/_templates/project.mdx`, copie tudo
5. Cole o modelo no seu novo arquivo
6. Preencha os campos (siga o **Guia de Conteúdo** para saber o que colocar em cada campo)
7. Desça, clique **Commit changes**

## Passo 6: Enviar uma imagem

Se seu poema ou projeto tem uma capa:

1. Abra a pasta `/public/images/poems` (ou `/public/images/projects`)
2. Clique **Add file** → **Upload files**
3. Selecione a imagem do seu computador
4. Clique **Commit changes**
5. **Copie o nome do arquivo** (ex: `rosa-vermelha.jpg`)
6. Abra seu poema/projeto e coloque esse nome no campo `coverImage`
   - Ex: `coverImage: /images/poems/rosa-vermelha.jpg`

## Como o site atualiza?

- Quando você faz **Commit changes**, o GitHub salva a mudança
- Um robô (Vercel) percebe a mudança e **reconstrói o site** automaticamente
- Em 1-5 minutos, as mudanças aparecem no site ao vivo

Você não precisa fazer mais nada — é automático!

## Se cometeu um erro

Não se preocupe, é fácil desfazer:

1. Abra o arquivo que editou
2. Clique no histórico (no GitHub, há um botão **History** ou ⏱️)
3. Procure a versão anterior (o GitHub guarda tudo)
4. Clique **Revert this commit** ou copie a versão antiga manualmente

## Próximos passos

Depois de criar sua conta e entender essa navegação básica, leia o **Guia de Conteúdo** (`CONTENT_GUIDE.md`) para aprender:
- Quais campos preencher em cada arquivo
- O formato correto para datas, categorias, tags, etc.
- Como editar textos da página inicial, Sobre, e configurações gerais

## Perguntas frequentes

**P: Eu preciso saber programação?**
R: Não! O GitHub oferece um editor visual que funciona como um editor de texto simples. Você apenas escreve e salva.

**P: Posso quebrar algo?**
R: Você só pode editar arquivos dentro de `/content`. A pasta de código (`/app`, `/components`) está protegida — o GitHub avisa se você está tentando editar lá. E sempre há histórico para desfazer.

**P: Quanto tempo leva para aparecer no site?**
R: 1-5 minutos, geralmente. Dá uma atualizada no navegador (F5) se não vir a mudança.

**P: Como insiro uma imagem no poema?**
R: No arquivo `.mdx`, você pode usar:
```markdown
![Descrição da imagem](/images/poems/nome-da-imagem.jpg)
```

**P: Posso usar formatação especial (negrito, itálico)?**
R: Sim! Use:
- `**texto em negrito**`
- `*texto em itálico*`
- `[link](https://exemplo.com)`

Boa sorte! 📝

# Como Começar — Guia para Editar Conteúdo

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

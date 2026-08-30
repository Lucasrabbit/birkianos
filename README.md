# Birkianos Trips

Diário de viagem — roteiros, paradas, notas e fotos.

**Stack:** Next.js 14 (App Router) · [Neon](https://neon.tech) (Postgres serverless) · Google Drive (armazenamento das fotos) · Vercel.

Não usa nenhum BaaS: o Next.js fala direto com o Postgres (via API routes / `lib/db.ts`) e com a Drive API (via `lib/googleDrive.ts`). Sem login — é um app pessoal, de uso privado.

## Setup local

```bash
npm install --legacy-peer-deps
cp .env.local.example .env.local   # preencha as variáveis, veja abaixo
npm run dev
```

## 1. Banco de dados (Neon)

1. Crie um projeto em [neon.tech](https://neon.tech) (free tier).
2. Copie a **connection string** (formato `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`) e coloque em `DATABASE_URL`.

Não precisa rodar `db/schema.sql` manualmente — o app cria as tabelas sozinho (`CREATE TABLE IF NOT EXISTS`/`CREATE OR REPLACE`, tudo idempotente) na primeira request depois de `DATABASE_URL` configurada. O arquivo [`db/schema.sql`](./db/schema.sql) fica só como referência/para uso com `psql` fora do app, se quiser.

Com isso o app já funciona por completo (viagens, paradas, notas, timeline, mapa, impressão) — o passo abaixo é opcional e pode ficar pra depois.

## 2. Fotos (Google Drive) — opcional

Sem essas variáveis configuradas, o app funciona normalmente; só o botão de "adicionar fotos" no Museu de Nós fica escondido (`GET /api/config` detecta que faltam as credenciais e o front some com o controle sozinho, sem erro).

As fotos não ficam num bucket de terceiros — são enviadas para o **seu próprio Google Drive** (usa o armazenamento que você já tem lá) e o app faz o proxy dos bytes, então elas continuam privadas (não dependem de link público do Drive). O processo de credenciais do Google é um pouco burocrático; quando quiser habilitar, o passo a passo é:

1. **Crie um projeto** no [Google Cloud Console](https://console.cloud.google.com/) (ou reaproveite um existente).
2. **Ative a API**: menu *APIs & Services → Library* → busque "Google Drive API" → *Enable*.
3. **Configure a tela de consentimento OAuth**: *APIs & Services → OAuth consent screen*.
   - User type: **External**.
   - Preencha nome do app e e-mail de suporte (pode ser o seu).
   - Em *Test users*, adicione o seu próprio e-mail do Google.
   - Depois de criar, clique em **Publish App** (Testing → Production). Isso evita um problema comum: enquanto o app fica em "Testing", o refresh token expira sozinho depois de 7 dias. Publicado, ele não expira.
   - Como o escopo usado (`drive.file`, veja abaixo) não é sensível, não é preciso passar por revisão do Google — pode ser que apareça uma tela "app não verificado" no primeiro login; clique em *Advanced → Ir para [nome do app] (não seguro)*. É seguro porque o app é seu.
4. **Crie as credenciais**: *APIs & Services → Credentials → Create Credentials → OAuth client ID*.
   - Application type: **Web application**.
   - Em *Authorized redirect URIs*, adicione: `https://developers.google.com/oauthplayground`.
   - Copie o **Client ID** e o **Client Secret** gerados → `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
5. **Gere o refresh token** com o [OAuth Playground](https://developers.google.com/oauthplayground):
   - Clique no ⚙️ (canto superior direito) → marque *Use your own OAuth credentials* → cole o Client ID e Client Secret do passo anterior.
   - Na lista de escopos à esquerda, ache "Drive API v3" e selecione **apenas** `https://www.googleapis.com/auth/drive.file` (dá acesso só aos arquivos que o próprio app cria — não ao seu Drive inteiro).
   - Clique em *Authorize APIs*, faça login com a conta Google cujo armazenamento você quer usar, aceite.
   - No Step 2, clique em *Exchange authorization code for tokens* → copie o **Refresh token** → `GOOGLE_REFRESH_TOKEN`.
6. `GOOGLE_DRIVE_FOLDER_ID` é opcional — deixe em branco pra começar (as fotos vão pra raiz do seu Drive, "Meu Drive", o que funciona sem passos extras com o escopo `drive.file`). Uma pasta criada manualmente por você no Drive não fica visível pro app com esse escopo restrito, só pastas que o próprio app cria.

## Deploy (Vercel)

O projeto **birkianos** já está linkado neste repo na Vercel (deploy automático a cada push). Falta só:

1. *Project Settings → Environment Variables* → adicione `DATABASE_URL` (Production **e** Preview, se quiser testar direto pela URL de preview desta branch antes de dar merge).
2. As variáveis do Google (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_DRIVE_FOLDER_ID`) entram do mesmo jeito quando as fotos forem habilitadas — não são necessárias agora.
3. Depois de salvar a variável, redeploy (a Vercel não aplica env var nova em builds já existentes): *Deployments* → nos "..." do último deploy → *Redeploy*.

# Jornal Porto do Pecém — Painel da Redação

Sistema administrativo (CMS) do site [jornalportodopecem.com.br](https://jornalportodopecem.com.br/),
com a identidade visual do jornal (marinho `#142248`, petróleo `#009999`, Roboto).

## Stack

- **Next.js 16** (App Router, Turbopack) — rotas por pastas em `src/app`, build e servidor
- **React 19** + **TypeScript**
- **Zustand** — estado global
- **Axios** — HTTP client, centralizado em `src/lib/http.ts`
- **CSS puro** — tokens em `src/styles/tokens.css`, primitivos em `src/styles/base.css` e CSS Modules por tela (ver `docs/DESIGN-SYSTEM.md`)
- **lucide-react** — ícones
- **Docker** — build multi-stage com o servidor `standalone` do Next
- **ESLint + Prettier + Husky/lint-staged** — qualidade de código
- **Vitest** — testes unitários

## Telas

- **Login** — entrada no painel, pela API real
- **Equipe** (`/usuarios`) — pessoas com acesso e papéis, pela API real
- Tema claro/escuro e layout responsivo

As demais telas do painel (notícias, editorias, mídia, anúncios) vão entrar aos poucos. A referência visual delas está em `jornal-pecem-admin.zip`.

## Estrutura (feature-based)

```
src/
  app/                    rotas do Next (cada pasta = uma URL)
    layout.tsx              layout raiz (html, fontes, tema inicial)
    providers.tsx           leitura de token/tema + toasts
    (auth)/login/           /login -> GuestRoute
    (app)/                  área logada -> ProtectedRoute + DefaultLayout
    not-found.tsx           404
    healthz/route.ts        healthcheck
  styles/                 tokens.css (design tokens) e base.css (primitivos)
  lib/                    http.ts (axios), format.ts
  services/               BaseService.ts (CRUD genérico)
  stores/                 createCrudStore.ts (store padrão) e uiStore.ts (tema, toasts)
  types/                  tipos compartilhados (BaseEntity, PaginatedResponse...)
  router/                 ProtectedRoute.tsx, GuestRoute.tsx (guardas usadas nos layouts)
  layouts/                DefaultLayout (sidebar + topbar)
  hooks/                  useCrud.ts (alternativa leve a uma store)
  shared/                 NotFoundPage e ui/ (componentes do design system)
  features/
    auth/  users/
    <nova-feature>/
      services/  store/  types/  pages/
```

## Padrão de service

- `src/services/BaseService.ts` implementa `getAll`, `getById`, `create`, `update`, `replace`, `delete`.
- Toda feature com um recurso REST convencional cria um service que **estende** o `BaseService`:

  ```ts
  class ProductService extends BaseService<Product> {
    constructor() { super('/products') }
  }
  ```

- Fluxos que não são CRUD (login, upload, relatórios) ganham um service próprio, usando `http` diretamente (veja `features/auth/services/authService.ts`).

## Comandos

Requer Node 20.9+ (o `.nvmrc` do projeto aponta para o 20: rode `nvm use`).

```bash
npm install
npm run dev        # dev server (http://localhost:3000)
npm run build      # build de produção (type-check + next build; o lint fica no `npm run lint`)
npm run start      # serve o build de produção
npm run typecheck  # tsc --noEmit
npm run lint       # eslint --fix
npm run format     # prettier
npm run test       # vitest run
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME="Jornal Porto do Pecém"
```

Variáveis `NEXT_PUBLIC_*` são embutidas no JS do navegador **no build**: mudou o valor, gere o build de novo.

## Docker

```bash
docker compose up --build
# app disponível em http://localhost:8080
```

O `Dockerfile` faz build multi-stage e roda o servidor `standalone` do Next (`node server.js`, porta 3000 no container). Os cabeçalhos de segurança ficam em `next.config.ts` e o healthcheck em `src/app/healthz/route.ts`.

## Adicionando uma tela

1. Crie o componente em `src/features/<feature>/pages/XPage.tsx`, com `'use client'` se usar hooks ou store, seguindo `docs/DESIGN-SYSTEM.md`.
2. Crie a rota em `src/app/(app)/<url>/page.tsx`, exportando o componente como `default`.
3. Adicione o item à lista `grupos` em `src/layouts/DefaultLayout.tsx`.

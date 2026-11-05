# Contrato da API REST

O painel fala com a API em `NEXT_PUBLIC_API_BASE_URL`, autenticando com
`Authorization: Bearer <token>`. Erros seguem `{ statusCode, message }`, com `message`
em texto ou lista de textos (ver `src/lib/http.ts`).

| Método | Rota | Corpo / Query | Resposta |
|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | `{ token, user }` |
| GET | `/auth/me` | — | `User` |
| POST | `/auth/logout` | — | `204` |
| GET | `/users` | `page, perPage` | `PaginatedResponse<User>` |
| POST | `/users` | `{ name, email, password, role, active }` | `User` |
| PATCH | `/users/:id` | parcial | `User` |
| DELETE | `/users/:id` | — | `204` |

`role` aceita `admin`, `editor` ou `viewer`.

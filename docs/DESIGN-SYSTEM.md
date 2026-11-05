# Design system — Painel da Redação

Baseado na identidade do site público: logotipo com rosa-dos-ventos, palavra
"JORNAL" em petróleo, barra de navegação marinho, corpo em Roboto.

## Cores

| Papel | Token | Valor | Onde usar |
|---|---|---|---|
| Estrutura | `--navy-900` | `#142248` | Sidebar, botão `.btn-navy`, tooltips, toasts |
| Ação | `--accent` / `--teal-500` | `#009999` | Botão primário, links, aba/menu ativo, foco |
| Ação hover | `--accent-hover` | `#008585` | — |
| Fundo suave da ação | `--accent-soft` | `#eef9f9` | Ícones de KPI, tags, seleção |
| Destaque | `--sand-500` | `#c9a14a` | Estrela de destaque, ponto da bússola, avisos de modo demo |
| Texto | `--text` | `#212529` | Corpo |
| Texto secundário | `--text-muted` | `#7a869c` | Metadados, datas |
| Superfície | `--surface` | `#ffffff` | Cards |
| Fundo da página | `--bg` | `#f2f5f9` | `body` |

Semânticas: `--success-*` (publicada, no ar), `--warning-*` (em revisão),
`--danger-*` (excluir, erros), `--info-*` (agendada, programado).

Contraste: petróleo `#009999` sobre branco passa AA para texto grande e
componentes; para texto pequeno sobre branco prefira `--teal-700`.

## Tipografia

- UI: **Roboto** 400/500/700
- Títulos de matéria e números de destaque: **Roboto Serif** 700 (`--font-headline`)
- Slugs/código: **Roboto Mono** (`--font-mono`)
- Escala: `--fs-xs` 12 · `--fs-sm` 13 · `--fs-md` 15 · `--fs-lg` 18 · `--fs-xl` 24 · `--fs-2xl` 32
- Rótulos de seção (`.eyebrow`): 12px, caixa alta, `letter-spacing: .08em`, cor de ação

## Espaço, forma, profundidade

- Grade de 4px: `--sp-1`…`--sp-7` (4, 8, 12, 16, 24, 32, 48)
- Raios: `--radius-sm` 6 (inputs, botões) · `--radius` 10 · `--radius-lg` 14 (cards)
- Sombras baixas e frias (tom marinho); cards usam borda + `--shadow-sm`

## Componentes

Ficam em `src/shared/ui/`.

| Componente | Uso |
|---|---|
| `PageHeader` | Topo de toda tela: `eyebrow`, `titulo`, `subtitulo`, ações em `children` |
| `AppModal` | Formulários curtos e confirmações; fecha com Esc e clique fora; ações na prop `rodape` |
| `AppToggle` | Liga/desliga (`checked`/`onChange`); sem `rotulo`, passe `ariaLabel` |
| `EmptyState` | Lista vazia com ação sugerida |
| `BrandMark` | Marca (bússola + "JORNAL Porto do Pecém"); `claro` para fundo escuro |

Classes globais em `src/styles/base.css`: `.page`, `.card`, `.card-header`, `.card-body`,
`.btn` + (`-primary`, `-navy`, `-ghost`, `-danger`, `-icon`), `.field`, `.input`,
`.select`, `.textarea`, `.table`, `.table-wrap`, `.chip`, `.eyebrow`, `.muted`, `.sr-only`.

O CSS específico de cada tela fica num CSS Module ao lado dela (`XPage.module.css`).
Dentro de um module, para mirar uma classe global use `:global(.input)`.

## Regras

- Nunca escreva hex soltos em componentes: use `var(--token)`. Se faltar cor, crie o token em
  `src/styles/tokens.css` (claro **e** escuro).
- Toda tela começa com `<div className="page">` + `<PageHeader>`.
- Ações destrutivas passam por `AppModal`, com texto explicando a consequência.
- Feedback de sucesso/erro via `useUiStore().notificar(texto, tipo)`.
- Rótulos de formulário visíveis (`.field > label`); ícone sozinho precisa de `aria-label`.
- Teste em 375px de largura e no tema escuro.

import type { Role } from '@/features/users/types/user'

const data = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

export const fmtData = (iso: string | null | undefined) =>
  iso ? data.format(new Date(iso.length === 10 ? iso + 'T12:00:00' : iso)).replace('.', '') : '—'

// Os papéis são os que a API aceita hoje (Roles.cs no backend).
export const papelLabel: Record<Role, string> = {
  admin: 'Administrador',
  editor: 'Editor-chefe',
  viewer: 'Visualizador',
}

export const iniciais = (nome: string) =>
  nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')

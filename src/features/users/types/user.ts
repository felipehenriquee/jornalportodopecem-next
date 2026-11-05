import type { BaseEntity } from '@/types/api'

export type Role = 'admin' | 'editor' | 'viewer'

export interface User extends BaseEntity {
  name: string
  email: string
  role: Role
  active: boolean
}

/** Payload de criação: sem id/timestamps (gerados pela API) e com a senha (mín. 6 caracteres) */
export type CreateUserPayload = Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }

/** Payload de atualização: tudo opcional (PATCH parcial); senha só se for trocar */
export type UpdateUserPayload = Partial<CreateUserPayload>

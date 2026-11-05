import { create } from 'zustand'

import type { BaseService } from '@/services/BaseService'
import type { BaseEntity, QueryParams } from '@/types/api'

export interface CrudState<T extends BaseEntity, TCreate, TUpdate> {
  items: T[]
  loading: boolean
  loaded: boolean
  error: string | null
  fetchAll: (params?: QueryParams) => Promise<void>
  create: (payload: TCreate) => Promise<T>
  update: (id: T['id'], payload: TUpdate) => Promise<T>
  remove: (id: T['id']) => Promise<void>
}

/** Store Zustand padrão de uma feature CRUD, em cima de qualquer service. */
export function createCrudStore<T extends BaseEntity, TCreate = Partial<T>, TUpdate = Partial<T>>(
  service: BaseService<T, TCreate, TUpdate>,
) {
  return create<CrudState<T, TCreate, TUpdate>>()((set, get) => ({
    items: [],
    loading: false,
    loaded: false,
    error: null,

    async fetchAll(params) {
      set({ loading: true, error: null })
      try {
        const res = await service.getAll(params)
        set({ items: Array.isArray(res) ? res : res.data, loaded: true })
      } catch (err) {
        set({ error: (err as Error).message })
      } finally {
        set({ loading: false })
      }
    },

    async create(payload) {
      const created = await service.create(payload)
      set({ items: [created, ...get().items] })
      return created
    },

    async update(id, payload) {
      const updated = await service.update(id, payload)
      set({ items: get().items.map((x) => (x.id === id ? updated : x)) })
      return updated
    },

    async remove(id) {
      await service.delete(id)
      set({ items: get().items.filter((x) => x.id !== id) })
    },
  }))
}

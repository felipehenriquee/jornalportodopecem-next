/** Contrato mínimo que toda entidade CRUD precisa ter para usar o BaseService. */
export interface BaseEntity {
  id: string | number
  createdAt?: string
  updatedAt?: string
}

/** Formato de resposta paginada, comum em listagens de API REST. */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

/** Query params aceitos por getAll (filtros, paginação, ordenação, busca). */
export interface QueryParams {
  page?: number
  perPage?: number
  sort?: string
  search?: string
  [key: string]: string | number | boolean | undefined
}

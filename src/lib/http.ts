import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

/**
 * Instância única do Axios usada por TODOS os services (global e de feature).
 * Centraliza:
 *  - base URL (via .env -> NEXT_PUBLIC_API_BASE_URL)
 *  - injeção do token de autenticação
 *  - tratamento padrão de erros (401 -> logout automático)
 */
export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ---- Request interceptor: injeta o Bearer token ----
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---- Response interceptor: trata erros de forma centralizada ----
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Sessão expirada/inválida: limpa o token e manda pro login.
      // Acesso direto ao localStorage (em vez de importar o authStore) evita
      // dependência circular entre lib/http.ts e features/auth/store.
      localStorage.removeItem('auth_token')
      if (!window.location.pathname.startsWith('/login')) {
        // Recarga completa de propósito: zera as stores (o authStore ainda teria o token)
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = '/login'
      }
    }

    // Normaliza a mensagem de erro para quem consome o service. A API devolve
    // `message` como string ou como string[] (um item por erro de validação).
    const apiMessage = (error.response?.data as { message?: string | string[] } | undefined)
      ?.message
    const message =
      (Array.isArray(apiMessage) ? apiMessage.join('\n') : apiMessage) ??
      error.message ??
      'Erro inesperado ao comunicar com a API'

    return Promise.reject(new Error(message))
  },
)

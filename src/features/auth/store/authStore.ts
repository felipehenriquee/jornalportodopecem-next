import { create } from 'zustand'

import { authService } from '@/features/auth/services/authService'
import type { AuthUser, LoginPayload } from '@/features/auth/types/auth'

interface AuthState {
  token: string | null
  user: AuthUser | null
  loading: boolean
  error: string | null
  /** true depois que o token foi lido do localStorage (só existe no navegador) */
  hydrated: boolean
  hydrate: () => void
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
}

/**
 * Store de autenticação (equivalente ao useAuthStore do Pinia / AuthStore
 * de Signals do Angular).
 *
 * O token é lido/gravado em `localStorage` sob a MESMA chave ("auth_token")
 * que `lib/http.ts` usa no interceptor do Axios — de propósito não usamos
 * o middleware `persist` do zustand aqui, pra não ter duas fontes de
 * verdade (a chave do zustand-persist e a chave que o interceptor lê).
 * `user` não é persistido; ele é reidratado via `fetchCurrentUser()`
 * (chame isso uma vez no bootstrap do app se quiser restaurar o usuário
 * logado após um refresh de página).
 *
 * No Next o módulo também é avaliado no servidor, onde não há `localStorage`.
 * Por isso o token começa `null` e só é lido em `hydrate()`, chamado uma vez
 * pelo `Providers` (src/app/providers.tsx) já no navegador. As guardas de
 * rota esperam `hydrated` antes de decidir para onde redirecionar.
 */
export const useAuthStore = create<AuthState>()((set, get) => ({
  token: null,
  user: null,
  loading: false,
  error: null,
  hydrated: false,

  hydrate() {
    if (get().hydrated) return
    set({ token: localStorage.getItem('auth_token'), hydrated: true })
  },

  async login(payload) {
    set({ loading: true, error: null })
    try {
      const response = await authService.login(payload)
      set({ token: response.token, user: response.user })
      localStorage.setItem('auth_token', response.token)
    } catch (err) {
      set({ error: (err as Error).message })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  async logout() {
    try {
      await authService.logout()
    } finally {
      set({ token: null, user: null })
      localStorage.removeItem('auth_token')
    }
  },

  /** Recarrega o usuário logado a partir do token salvo (ex: no refresh da página). */
  async fetchCurrentUser() {
    if (!get().token) return
    const user = await authService.me()
    set({ user })
  },
}))

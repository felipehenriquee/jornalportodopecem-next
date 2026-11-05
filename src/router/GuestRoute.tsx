'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'

// Só aceita caminhos internos ("/users"), nunca "//site.com" ou "/\site.com"
function isSafeRedirect(path: string | null): path is string {
  return !!path && /^\/(?![/\\])/.test(path)
}

/**
 * Guarda inversa: usada na rota de /login para impedir que um usuário já
 * autenticado volte pra tela de login. Equivalente ao guestGuard da versão
 * Angular.
 *
 * Também é ela que redireciona logo após o login (o token aparece na store
 * e o efeito abaixo dispara), respeitando o ?redirect= da ProtectedRoute.
 */
export function GuestRoute({ children }: { children: ReactNode }) {
  const router = useRouter()
  const hydrated = useAuthStore((state) => state.hydrated)
  const isAuthenticated = useAuthStore((state) => !!state.token)

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      const redirect = new URLSearchParams(window.location.search).get('redirect')
      router.replace(isSafeRedirect(redirect) ? redirect : '/')
    }
  }, [hydrated, isAuthenticated, router])

  if (!hydrated || isAuthenticated) {
    return null
  }

  return <>{children}</>
}

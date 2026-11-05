'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'

/**
 * Guarda de rota: bloqueia acesso a rotas privadas sem sessão ativa,
 * redirecionando para /login (com ?redirect=). Equivalente ao
 * router.beforeEach global (Vue) / authGuard (Angular).
 *
 * Uso em src/app/(app)/layout.tsx: envolve as páginas privadas, que só
 * são renderizadas se autenticado. Enquanto o token não foi lido do
 * localStorage (`hydrated`), não renderiza nada para evitar "piscar" a tela.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const hydrated = useAuthStore((state) => state.hydrated)
  const isAuthenticated = useAuthStore((state) => !!state.token)

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [hydrated, isAuthenticated, pathname, router])

  if (!hydrated || !isAuthenticated) {
    return null
  }

  return <>{children}</>
}

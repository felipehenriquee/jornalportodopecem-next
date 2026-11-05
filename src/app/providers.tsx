'use client'

import { useEffect, type ReactNode } from 'react'

import { useAuthStore } from '@/features/auth/store/authStore'
import { ToastHost } from '@/shared/ui/ToastHost'
import { useUiStore } from '@/stores/uiStore'

export function Providers({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate)
  const hydrateTema = useUiStore((state) => state.hydrateTema)

  // Lê token e tema do localStorage uma vez, já no navegador
  useEffect(() => {
    hydrate()
    hydrateTema()
  }, [hydrate, hydrateTema])

  return (
    <>
      {children}
      <ToastHost />
    </>
  )
}

import type { ReactNode } from 'react'

import { ProtectedRoute } from '@/router/ProtectedRoute'
import { DefaultLayout } from '@/layouts/DefaultLayout'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{children}</DefaultLayout>
    </ProtectedRoute>
  )
}

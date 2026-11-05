import type { ReactNode } from 'react'

import { GuestRoute } from '@/router/GuestRoute'

export default function Layout({ children }: { children: ReactNode }) {
  return <GuestRoute>{children}</GuestRoute>
}

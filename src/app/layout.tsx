import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto-serif/500.css'
import '@fontsource/roboto-serif/700.css'
import '@fontsource/roboto-mono/500.css'
import '@/styles/base.css'

import { Providers } from '@/app/providers'

export const metadata: Metadata = {
  title: {
    default: `Redação · ${process.env.NEXT_PUBLIC_APP_NAME ?? 'Jornal Porto do Pecém'}`,
    template: '%s · Redação JPP',
  },
}

// Aplica o tema salvo antes da primeira pintura, para o tema escuro não "piscar".
const temaInicial = `try{if(localStorage.getItem('jpp.tema')==='escuro')document.documentElement.dataset.theme='dark'}catch(e){}`

/**
 * Layout raiz (substitui o index.html + main.tsx do Vite). As rotas ficam
 * nas pastas de src/app, agrupadas por guarda:
 *  - (auth)/  -> GuestRoute (login)
 *  - (app)/   -> ProtectedRoute + DefaultLayout (área logada)
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaInicial }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

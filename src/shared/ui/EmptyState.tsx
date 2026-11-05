import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

import styles from './EmptyState.module.css'

interface EmptyStateProps {
  titulo: string
  texto?: string
  children?: ReactNode
}

export function EmptyState({ titulo, texto, children }: EmptyStateProps) {
  return (
    <div className={styles.vazio}>
      <Inbox size={28} />
      <strong>{titulo}</strong>
      {texto && <p className="muted">{texto}</p>}
      {children}
    </div>
  )
}

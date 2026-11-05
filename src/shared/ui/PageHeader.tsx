import type { ReactNode } from 'react'

import styles from './PageHeader.module.css'

interface PageHeaderProps {
  titulo: string
  subtitulo?: string
  eyebrow?: string
  children?: ReactNode
}

export function PageHeader({ titulo, subtitulo, eyebrow, children }: PageHeaderProps) {
  return (
    <header className={styles.ph}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{titulo}</h1>
        {subtitulo && <p className={`muted ${styles.sub}`}>{subtitulo}</p>}
      </div>
      <div className={styles.acoes}>{children}</div>
    </header>
  )
}

'use client'

import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import styles from './AppModal.module.css'

interface AppModalProps {
  titulo: string
  largura?: string
  onFechar: () => void
  rodape?: ReactNode
  children: ReactNode
}

export function AppModal({ titulo, largura = '520px', onFechar, rodape, children }: AppModalProps) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onFechar])

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar()
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        style={{ maxWidth: largura }}
      >
        <header className={styles.header}>
          <h2>{titulo}</h2>
          <button className="btn btn-ghost btn-icon" aria-label="Fechar" onClick={onFechar}>
            <X />
          </button>
        </header>
        <div className={styles.corpo}>{children}</div>
        {rodape && <footer className={styles.footer}>{rodape}</footer>}
      </div>
    </div>,
    document.body,
  )
}

'use client'

import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

import { useUiStore } from '@/stores/uiStore'

import styles from './ToastHost.module.css'

const icones = { sucesso: CheckCircle2, erro: AlertCircle, info: Info }

export function ToastHost() {
  const toasts = useUiStore((state) => state.toasts)

  return (
    <div className={styles.host} role="status" aria-live="polite">
      {toasts.map((t) => {
        const Icone = icones[t.tipo]
        return (
          <div key={t.id} className={`${styles.toast} ${styles[t.tipo]}`}>
            <Icone size={18} />
            <span>{t.texto}</span>
          </div>
        )
      })}
    </div>
  )
}

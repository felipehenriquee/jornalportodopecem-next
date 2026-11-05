import styles from './BrandMark.module.css'

interface BrandMarkProps {
  tamanho?: number
  comTexto?: boolean
  claro?: boolean
}

/** Rosa-dos-ventos simplificada, inspirada no símbolo do jornal */
export function BrandMark({ tamanho = 36, comTexto = true, claro = false }: BrandMarkProps) {
  return (
    <div className={`${styles.brand} ${claro ? styles.claro : ''}`}>
      <svg width={tamanho} height={tamanho} viewBox="0 0 40 40" aria-hidden="true">
        <circle
          cx="20"
          cy="20"
          r="17"
          fill="none"
          stroke="currentColor"
          strokeOpacity=".35"
          strokeWidth="1.2"
        />
        <circle
          cx="20"
          cy="20"
          r="12.5"
          fill="none"
          stroke="currentColor"
          strokeOpacity=".2"
          strokeWidth="1"
          strokeDasharray="1.5 2.5"
        />
        <path d="M20 2l3.2 15.5L20 20l-3.2-2.5z" fill="var(--teal-400)" />
        <path d="M20 38l-3.2-15.5L20 20l3.2 2.5z" fill="var(--teal-600)" />
        <path d="M2 20l15.5-3.2L20 20l-2.5 3.2z" fill="currentColor" fillOpacity=".85" />
        <path d="M38 20l-15.5 3.2L20 20l2.5-3.2z" fill="currentColor" fillOpacity=".55" />
        <path
          d="M8 8l10 9-1 1zM32 32l-10-9 1-1zM32 8l-9 10-1-1zM8 32l9-10 1 1z"
          fill="currentColor"
          fillOpacity=".3"
        />
        <circle cx="20" cy="20" r="2" fill="var(--sand-500)" />
      </svg>
      {comTexto && (
        <div className={styles.txt}>
          <span className={styles.jornal}>JORNAL</span>
          <span className={styles.porto}>Porto do Pecém</span>
        </div>
      )}
    </div>
  )
}

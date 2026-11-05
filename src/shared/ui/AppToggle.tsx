import styles from './AppToggle.module.css'

interface AppToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  rotulo?: string
  /** Obrigatório na prática quando não há `rotulo` visível. */
  ariaLabel?: string
}

export function AppToggle({ checked, onChange, rotulo, ariaLabel }: AppToggleProps) {
  return (
    <label className={styles.tg}>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.trilho} aria-hidden="true">
        <span className={styles.bola} />
      </span>
      {rotulo && <span>{rotulo}</span>}
    </label>
  )
}

'use client'

import { useState, type FormEvent } from 'react'
import { LogIn } from 'lucide-react'

import { useAuthStore } from '@/features/auth/store/authStore'
import { BrandMark } from '@/shared/ui/BrandMark'

import styles from './LoginPage.module.css'

export function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.loading)
  const error = useAuthStore((state) => state.error)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      // O redirecionamento (para "/" ou ?redirect=) fica com o GuestRoute,
      // que reage ao token novo na store.
      await login({ email, password })
    } catch {
      // authStore.error já guarda a mensagem; exibida abaixo.
    }
  }

  return (
    <div className={styles.login}>
      <section className={styles.arte} aria-hidden="true">
        <div className={styles.ondas} />
        <BrandMark claro tamanho={64} />
        <div className={styles.frase}>
          <p className="eyebrow">Painel da Redação</p>
          <h1>A notícia do porto, do Ceará para o mundo.</h1>
        </div>
        <p className={styles.rodape}>Jornal Porto do Pecém · São Gonçalo do Amarante, CE</p>
      </section>

      <section className={styles['form-lado']}>
        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          <div>
            <h2>Entrar</h2>
            <p className="muted">Acesse com seu e-mail da redação.</p>
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              className="input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className={styles.erro} role="alert">
              {error}
            </p>
          )}

          <button className={`btn btn-primary ${styles.entrar}`} disabled={loading}>
            <LogIn /> {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </section>
    </div>
  )
}

'use client'

import { useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ExternalLink, LogOut, Menu, Moon, Sun, Users } from 'lucide-react'

import { useAuthStore } from '@/features/auth/store/authStore'
import type { Role } from '@/features/users/types/user'
import { iniciais, papelLabel } from '@/lib/format'
import { BrandMark } from '@/shared/ui/BrandMark'
import { useUiStore } from '@/stores/uiStore'

import styles from './DefaultLayout.module.css'

// Cada tela nova entra aqui como um item do menu.
const grupos = [
  {
    titulo: 'Gestão',
    itens: [{ to: '/usuarios', rotulo: 'Equipe', icone: Users }],
  },
]

const hoje = () =>
  new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(
    new Date(),
  )

export function DefaultLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser)
  const tema = useUiStore((state) => state.tema)
  const setTema = useUiStore((state) => state.setTema)
  const aberta = useUiStore((state) => state.sidebarAberta)
  const setAberta = useUiStore((state) => state.setSidebarAberta)
  const notificar = useUiStore((state) => state.notificar)

  // Depois de um refresh só o token sobrevive; nome e papel vêm de /auth/me.
  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser().catch((err: Error) => notificar(err.message, 'erro'))
    }
  }, [token, user, fetchCurrentUser, notificar])

  const ativo = (to: string) => pathname.startsWith(to)

  async function sair() {
    try {
      await logout()
    } catch {
      // A sessão local já foi limpa pelo authStore, mesmo se a API não respondeu.
    }
    router.replace('/login')
  }

  return (
    <div className={`${styles.shell} ${aberta ? styles.aberta : ''}`}>
      <aside className={styles.sidebar}>
        <div className={styles.topo}>
          <BrandMark claro tamanho={34} />
        </div>

        <nav className={styles.nav} aria-label="Principal">
          {grupos.map((g) => (
            <div key={g.titulo}>
              <p className={styles['grupo-titulo']}>{g.titulo}</p>
              {g.itens.map((i) => (
                <Link
                  key={i.to}
                  href={i.to}
                  className={`${styles.item} ${ativo(i.to) ? styles.ativo : ''}`}
                  aria-current={ativo(i.to) ? 'page' : undefined}
                  onClick={() => setAberta(false)}
                >
                  <i.icone size={18} />
                  {i.rotulo}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <a
          className={`${styles.item} ${styles.site}`}
          href="https://jornalportodopecem.com.br/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={16} /> Ver site
        </a>

        <div className={styles.perfil}>
          <span className={styles.avatar}>{iniciais(user?.name ?? '?')}</span>
          <div className={styles.quem}>
            <strong>{user?.name}</strong>
            <span>{user?.role ? (papelLabel[user.role as Role] ?? user.role) : ''}</span>
          </div>
          <button className={styles.sair} aria-label="Sair" title="Sair" onClick={sair}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <div className={styles.veu} onClick={() => setAberta(false)} />

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            className={`btn btn-ghost btn-icon ${styles.menu}`}
            aria-label="Abrir menu"
            onClick={() => setAberta(true)}
          >
            <Menu size={18} />
          </button>
          <div className={styles.data}>
            <span className={styles.local}>Pecém</span>
            <span className="muted">{hoje()}</span>
          </div>
          <button
            className="btn btn-ghost btn-icon"
            aria-label={tema === 'claro' ? 'Ativar tema escuro' : 'Ativar tema claro'}
            onClick={() => setTema(tema === 'claro' ? 'escuro' : 'claro')}
          >
            {tema === 'claro' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}

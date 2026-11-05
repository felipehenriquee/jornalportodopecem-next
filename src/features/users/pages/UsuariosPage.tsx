'use client'

import { useEffect, useState } from 'react'
import { Pencil, Trash2, UserPlus } from 'lucide-react'

import { useAuthStore } from '@/features/auth/store/authStore'
import { useUserStore } from '@/features/users/store/userStore'
import type { Role, UpdateUserPayload, User } from '@/features/users/types/user'
import { fmtData, iniciais, papelLabel } from '@/lib/format'
import { AppModal } from '@/shared/ui/AppModal'
import { AppToggle } from '@/shared/ui/AppToggle'
import { EmptyState } from '@/shared/ui/EmptyState'
import { PageHeader } from '@/shared/ui/PageHeader'
import { useUiStore } from '@/stores/uiStore'

import styles from './UsuariosPage.module.css'

const papeis = Object.keys(papelLabel) as Role[]

const descricaoPapel: Record<Role, string> = {
  admin: 'Acesso total, incluindo equipe e configurações',
  editor: 'Revisa, publica e organiza editorias',
  viewer: 'Acompanha o painel; o que escrever vai para revisão',
}

interface Formulario {
  id: User['id'] | null
  name: string
  email: string
  password: string
  role: Role
  active: boolean
}

export function UsuariosPage() {
  const notificar = useUiStore((state) => state.notificar)
  const logado = useAuthStore((state) => state.user)
  const itens = useUserStore((state) => state.items)
  const loaded = useUserStore((state) => state.loaded)
  const error = useUserStore((state) => state.error)
  const fetchAll = useUserStore((state) => state.fetchAll)
  const create = useUserStore((state) => state.create)
  const update = useUserStore((state) => state.update)
  const remove = useUserStore((state) => state.remove)

  const [edicao, setEdicao] = useState<Formulario | null>(null)
  const [excluir, setExcluir] = useState<User | null>(null)

  useEffect(() => {
    fetchAll({ perPage: 100 })
  }, [fetchAll])

  useEffect(() => {
    if (error) notificar(error, 'erro')
  }, [error, notificar])

  function novo() {
    setEdicao({ id: null, name: '', email: '', password: '', role: 'viewer', active: true })
  }

  function editar(u: User) {
    setEdicao({
      id: u.id,
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      active: u.active,
    })
  }

  async function salvar() {
    if (!edicao) return
    if (edicao.name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(edicao.email)) {
      notificar('Preencha nome e um e-mail válido', 'erro')
      return
    }
    // A API exige senha na criação. Na edição, em branco = manter a atual.
    if (edicao.password ? edicao.password.length < 6 : edicao.id === null) {
      notificar('A senha precisa ter ao menos 6 caracteres', 'erro')
      return
    }
    const { id, password, ...dados } = edicao
    try {
      if (id === null) {
        await create({ ...dados, password })
      } else {
        const payload: UpdateUserPayload = password ? { ...dados, password } : dados
        await update(id, payload)
      }
      notificar(id === null ? 'Pessoa adicionada' : 'Dados atualizados')
      setEdicao(null)
    } catch (err) {
      // Ex: e-mail duplicado (409) ou erro de validação (400) vindos da API
      notificar((err as Error).message, 'erro')
    }
  }

  async function confirmarExclusao() {
    if (!excluir) return
    try {
      await remove(excluir.id)
      notificar('Acesso removido')
      setExcluir(null)
    } catch (err) {
      notificar((err as Error).message, 'erro')
    }
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Gestão"
        titulo="Equipe"
        subtitulo="Quem tem acesso ao painel e o que cada um pode fazer."
      >
        <button className="btn btn-primary" onClick={novo}>
          <UserPlus /> Adicionar pessoa
        </button>
      </PageHeader>

      <section className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Papel</th>
                <th>Cadastro</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {itens.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className={styles.pessoa}>
                      <span className={`${styles.av} ${styles[u.role] ?? ''}`}>
                        {iniciais(u.name)}
                      </span>
                      <div>
                        <strong>{u.name}</strong>
                        <span className="muted">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="chip">{papelLabel[u.role] ?? u.role}</span>
                  </td>
                  <td className="muted">{fmtData(u.createdAt)}</td>
                  <td>
                    <span className={u.active ? styles.ativo : 'muted'}>
                      {u.active ? 'Ativo' : 'Desativado'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.acoes}>
                      <button
                        className="btn btn-ghost btn-icon"
                        aria-label={`Editar ${u.name}`}
                        onClick={() => editar(u)}
                      >
                        <Pencil />
                      </button>
                      {u.id !== logado?.id && (
                        <button
                          className="btn btn-danger btn-icon"
                          aria-label={`Remover ${u.name}`}
                          onClick={() => setExcluir(u)}
                        >
                          <Trash2 />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loaded && !itens.length && <EmptyState titulo="Nenhuma pessoa cadastrada" />}
        </div>
      </section>

      {edicao && (
        <AppModal
          titulo={edicao.id === null ? 'Adicionar pessoa' : 'Editar acesso'}
          onFechar={() => setEdicao(null)}
          rodape={
            <>
              <button className="btn btn-ghost" onClick={() => setEdicao(null)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={salvar}>
                {edicao.id === null ? 'Adicionar' : 'Salvar'}
              </button>
            </>
          }
        >
          <div className="field">
            <label htmlFor="un">Nome</label>
            <input
              id="un"
              className="input"
              value={edicao.name}
              onChange={(e) => setEdicao({ ...edicao, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="ue">E-mail</label>
            <input
              id="ue"
              type="email"
              className="input"
              value={edicao.email}
              onChange={(e) => setEdicao({ ...edicao, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="us">
              {edicao.id === null ? 'Senha' : 'Nova senha (deixe em branco para manter)'}
            </label>
            <input
              id="us"
              type="password"
              className="input"
              autoComplete="new-password"
              value={edicao.password}
              onChange={(e) => setEdicao({ ...edicao, password: e.target.value })}
            />
            <span className="hint">Mínimo de 6 caracteres</span>
          </div>
          <fieldset className={styles.papeis}>
            <legend>Papel</legend>
            {papeis.map((p) => (
              <label key={p} className={`${styles.papel} ${edicao.role === p ? styles.sel : ''}`}>
                <input
                  type="radio"
                  name="papel"
                  className="sr-only"
                  checked={edicao.role === p}
                  onChange={() => setEdicao({ ...edicao, role: p })}
                />
                <strong>{papelLabel[p]}</strong>
                <span className="muted">{descricaoPapel[p]}</span>
              </label>
            ))}
          </fieldset>
          {edicao.id !== null && (
            <AppToggle
              checked={edicao.active}
              onChange={(active) => setEdicao({ ...edicao, active })}
              rotulo="Acesso ativo"
            />
          )}
        </AppModal>
      )}

      {excluir && (
        <AppModal
          titulo="Remover acesso?"
          onFechar={() => setExcluir(null)}
          rodape={
            <>
              <button className="btn btn-ghost" onClick={() => setExcluir(null)}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                style={{ background: 'var(--danger-600)' }}
                onClick={confirmarExclusao}
              >
                Remover
              </button>
            </>
          }
        >
          <p style={{ margin: 0 }}>
            <strong>{excluir.name}</strong> perderá o acesso ao painel e o cadastro será apagado. Se
            for temporário, prefira desativar o acesso na edição.
          </p>
        </AppModal>
      )}
    </div>
  )
}

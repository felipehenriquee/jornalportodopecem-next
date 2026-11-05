import { create } from 'zustand'

export type Tema = 'claro' | 'escuro'

export interface Toast {
  id: number
  tipo: 'sucesso' | 'erro' | 'info'
  texto: string
}

interface UiState {
  tema: Tema
  sidebarAberta: boolean
  toasts: Toast[]
  /** Lê o tema salvo. Chamado pelo Providers, já no navegador. */
  hydrateTema: () => void
  setTema: (tema: Tema) => void
  setSidebarAberta: (aberta: boolean) => void
  notificar: (texto: string, tipo?: Toast['tipo']) => void
}

const TEMA_KEY = 'jpp.tema'
let seq = 0

export const useUiStore = create<UiState>()((set, get) => ({
  tema: 'claro',
  sidebarAberta: false,
  toasts: [],

  hydrateTema() {
    try {
      if (localStorage.getItem(TEMA_KEY) === 'escuro') set({ tema: 'escuro' })
    } catch {
      // storage indisponível: fica no tema claro
    }
  },

  setTema(tema) {
    set({ tema })
    document.documentElement.dataset.theme = tema === 'escuro' ? 'dark' : 'light'
    try {
      localStorage.setItem(TEMA_KEY, tema)
    } catch {
      // storage indisponível: o tema vale só para esta visita
    }
  },

  setSidebarAberta(sidebarAberta) {
    set({ sidebarAberta })
  },

  notificar(texto, tipo = 'sucesso') {
    const id = ++seq
    set({ toasts: [...get().toasts, { id, tipo, texto }] })
    setTimeout(() => set({ toasts: get().toasts.filter((t) => t.id !== id) }), 3800)
  },
}))

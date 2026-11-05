import Link from 'next/link'

import { BrandMark } from '@/shared/ui/BrandMark'
import { EmptyState } from '@/shared/ui/EmptyState'

export function NotFoundPage() {
  return (
    <div className="page" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <div
        className="card"
        style={{ padding: 'var(--sp-6)', display: 'grid', justifyItems: 'center' }}
      >
        <BrandMark />
        <EmptyState
          titulo="Página não encontrada"
          texto="O endereço pode ter mudado ou não existir mais."
        >
          <Link href="/" className="btn btn-primary">
            Voltar para o início
          </Link>
        </EmptyState>
      </div>
    </div>
  )
}

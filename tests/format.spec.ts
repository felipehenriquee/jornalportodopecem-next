import { describe, expect, it } from 'vitest'
import { fmtData, iniciais } from '@/lib/format'

describe('format', () => {
  it('iniciais usa as duas primeiras palavras', () => {
    expect(iniciais('Ana Maria Souza')).toBe('AM')
  })

  it('fmtData mostra um traço quando não há data', () => {
    expect(fmtData(undefined)).toBe('—')
  })
})

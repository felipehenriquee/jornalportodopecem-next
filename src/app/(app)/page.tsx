import { redirect } from 'next/navigation'

// Equipe é a única tela por enquanto; quando houver um painel inicial, ele entra aqui.
export default function Page() {
  redirect('/usuarios')
}

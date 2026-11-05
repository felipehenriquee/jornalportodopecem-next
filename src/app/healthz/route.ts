// Healthcheck simples para o container/orquestrador (antes ficava no nginx.conf)
export function GET() {
  return new Response('ok', { headers: { 'Content-Type': 'text/plain' } })
}

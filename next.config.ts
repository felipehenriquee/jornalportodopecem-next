import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Gera .next/standalone (servidor Node mínimo) usado pelo Dockerfile
  output: 'standalone',
  poweredByHeader: false,

  // Proxy opcional para a API em desenvolvimento (evita CORS)
  // async rewrites() {
  //   return [{ source: '/api/:path*', destination: 'http://localhost:3000/api/:path*' }]
  // },

  // Cabeçalhos de segurança básicos (antes ficavam no nginx.conf)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig

import type { NextConfig } from "next";

const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

// obs: this PrismaPlugin and module.exports fix error about 
/* 
[Server Action] Erro ao verificar usuário adrian.cristian.st@gmail.com: Error [PrismaClientInitializationError]: 
Invalid `prisma.user.findUnique()` invocation:


Prisma Client could not locate the Query Engine for runtime "rhel-openssl-3.0.x".
*/

module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },

  output: 'standalone', // Necessário para o Prisma funcionar corretamente no Vercel
  images: {
   remotePatterns: [
      {
        hostname: 'images.unsplash.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'developers.google.com',
        pathname: '**'
      },

       {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '**'
      },

      {
        protocol: 'https',
        hostname: 'www.casadecarnespine.com.br',
        pathname: '**'
      },

      {
        protocol: 'https',
        hostname: 'www.arenaatacado.com.br',
        pathname: '**'
      },

      {
        protocol: 'https',
        hostname: 'bretas.vtexassets.com',
        pathname: '**'
      },

    ],
}
} satisfies NextConfig;

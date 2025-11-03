// Nota: Removemos a tipagem explícita para permitir a opção `turbopack.root`
// e silenciar o aviso de múltiplos lockfiles.

const nextConfig = {
  turbopack: {
    // Define explicitamente a raiz do projeto para evitar a inferência incorreta
    root: process.cwd(),
  },
};

export default nextConfig;

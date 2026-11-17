// Endereço da API.
// Publicado: vem da variável VITE_API_URL (configurada na Vercel).
// No seu PC: como a variável não existe, usa o localhost.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
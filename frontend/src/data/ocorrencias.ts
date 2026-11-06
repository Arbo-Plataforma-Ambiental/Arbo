// Dados de exemplo: substituir pela API quando o front consumir /ocorrencias.
export const ocorrencias = [
    {
        id: 1,
        titulo: 'Descarte irregular de lixo',
        tipo: 'DESCARTE_IRREGULAR',
        status: 'PENDENTE',
        imagem: '/ocorrencias/descarte-lixo.jpg',
        posicao: [-23.5310, -46.3690] as [number, number]
    },
    {
        id: 2,
        titulo: 'Foco de queimada',
        tipo: 'QUEIMADA',
        status: 'APROVADA',
        imagem: '/ocorrencias/queimada.webp',
        posicao: [-23.5350, -46.3650] as [number, number]
    },
    {
        id: 3,
        titulo: 'Área verde revitalizada',
        tipo: 'REVITALIZACAO',
        status: 'RESOLVIDA',
        imagem: '/ocorrencias/revitalizada.jfif',
        posicao: [-23.5290, -46.3740] as [number, number]
    },
    {
        id: 4,
        titulo: 'Desmatamento em área urbana',
        tipo: 'DESMATAMENTO',
        status: 'RECUSADA',
        imagem: '/ocorrencias/desmatamento.webp',
        posicao: [-23.5380, -46.3710] as [number, number]
    }
]

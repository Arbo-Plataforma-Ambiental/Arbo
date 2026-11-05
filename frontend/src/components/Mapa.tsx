import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './Mapa.css'
import RodapeNav from './RodapeNav'
import { useState } from 'react'


function obterCor(status: string) {
    switch (status) {
        case 'PENDENTE':
            return '#E9B949'

        case 'APROVADA':
            return '#3685CC'

        case 'RECUSADA':
            return '#D94A4A'

        case 'RESOLVIDA':
            return '#2B8A48'

        default:
            return '#727B70'
    }
}

const ocorrencias = [
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


function Mapa() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [pesquisa, setPesquisa] = useState('')
    const ocorrenciasFiltradas = ocorrencias.filter((ocorrencia) =>
        `${ocorrencia.titulo} ${ocorrencia.tipo} ${ocorrencia.status}`
            .toLowerCase()
            .includes(pesquisa.toLowerCase())
    )
    return (
        <main className='pagina-mapa'>
            <input
                className="pesquisa-mapa"
                type="text"
                placeholder="Buscar local ou ocorrência..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
            />
            <MapContainer
                center={[-23.531821, -46.369772]}
                zoom={40}
                className='mapa-interativo'
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                ></TileLayer>
                {ocorrenciasFiltradas.map((ocorrencia) => (
                    <CircleMarker
                        key={ocorrencia.id}
                        center={ocorrencia.posicao}
                        radius={9}
                        pathOptions={{
                            color: obterCor(ocorrencia.status),
                            fillColor: obterCor(ocorrencia.status),
                            fillOpacity: 0.9
                        }}
                    >
                        <Popup>
                            <div className="conteudo-popup">
                                <img
                                    src={ocorrencia.imagem}
                                    alt={ocorrencia.titulo}
                                    className="imagem-ocorrencia"
                                />

                                <strong>{ocorrencia.titulo}</strong>

                                <p>Tipo: {ocorrencia.tipo}</p>

                                <p>Status: {ocorrencia.status}</p>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
                <div className="legenda-mapa">
                    <strong>Legenda</strong>

                    <div className="item-legenda">
                        <span className="bolinha-legenda pendente"></span>
                        <span>Pendente</span>
                    </div>

                    <div className="item-legenda">
                        <span className="bolinha-legenda aprovada"></span>
                        <span>Aprovada</span>
                    </div>

                    <div className="item-legenda">
                        <span className="bolinha-legenda recusada"></span>
                        <span>Recusada</span>
                    </div>

                    <div className="item-legenda">
                        <span className="bolinha-legenda resolvida"></span>
                        <span>Resolvida</span>
                    </div>
                </div>
            </MapContainer>

            <button
                className="botao-nova-denuncia"
                onClick={() => setMostrarFormulario(true)}
            >
                + Nova Denúncia
            </button>

            {mostrarFormulario && (
                <div className="fundo-modal">
                    <div className="modal-denuncia">
                        <button
                            className="fechar-modal"
                            onClick={() => setMostrarFormulario(false)}
                        >
                            ×
                        </button>

                        <h2>Nova Denúncia</h2>
                        <p>Registre uma ocorrência ambiental.</p>

                        <form
                            onSubmit={(evento) => {
                                evento.preventDefault()
                                alert('Denúncia registrada com sucesso! (SO TESTE)')
                                setMostrarFormulario(false)
                            }}
                        >
                            <label>Tipo de ocorrência</label>
                            <select required defaultValue="">
                                <option value="" disabled>Selecione o tipo</option>
                                <option value="DESCARTE_IRREGULAR">Descarte irregular</option>
                                <option value="QUEIMADA">Queimada</option>
                                <option value="DESMATAMENTO">Desmatamento</option>
                                <option value="ABANDONO">Abandono de área verde</option>
                            </select>

                            <label>Descrição</label>
                            <textarea
                                placeholder="Descreva o problema encontrado..."
                                required
                            />

                            <label>Fotografia</label>
                            <input type="file" accept="image/*" required />

                            <label>Localização</label>
                            <input
                                type="text"
                                placeholder="Ex.: Rua das Flores, Ferraz de Vasconcelos"
                                required
                            />

                            <button type="submit" className="botao-enviar-denuncia">
                                Enviar denúncia
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <RodapeNav />
        </main>

    )

}

export default Mapa
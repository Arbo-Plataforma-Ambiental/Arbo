import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './Mapa.css'
import RodapeNav from './RodapeNav'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ocorrencias } from '../data/ocorrencias'


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

function Mapa() {
    const [parametros] = useSearchParams()
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [pesquisa, setPesquisa] = useState(parametros.get('busca') ?? '')
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
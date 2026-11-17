import { API_URL } from '../config'
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './Mapa.css'
import RodapeNav from './RodapeNav'
import MapaCalor from './MapaCalor'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'


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

function CliqueNoMapa({ ativo, onClique }: { ativo: boolean; onClique: (posicao: [number, number]) => void }) {
    useMapEvents({
        click(evento) {
            if (ativo) {
                onClique([evento.latlng.lat, evento.latlng.lng])
            }
        },
    })
    return null
}

type Ocorrencia = {
    id: number
    titulo: string
    descricao: string
    tipo: string
    latitude: number
    longitude: number
    imagem: string | null
    status: string
    dataRegistro: string
    usuarioId: number
}

function Mapa() {
    const [parametros] = useSearchParams()

    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [modoCalor, setModoCalor] = useState(false)
    const [mostrarMarcadores, setMostrarMarcadores] = useState(true)
    const [pesquisa, setPesquisa] = useState(parametros.get('busca') ?? '')

    const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])

    // roda u a vez quando a tela abre e busca ocorrências
    useEffect(() => {
        fetch(`${API_URL}/ocorrencias`)
            .then((resposta) => resposta.json())
            .then((dados) => setOcorrencias(dados))
            .catch((erro) => console.error('Erro ao carregar ocorrências: ', erro))
    }, [])

    const [escolhendoLocal, setEscolhendoLocal] = useState(false)
    const [posicaoEscolhida, setPosicaoEscolhida] = useState<[number, number] | null>(null)
    const [titulo, setTitulo] = useState('')
    const [tipo, setTipo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [imagem, setImagem] = useState('')
    const [mensagemErro, setMensagemErro] = useState('')
    const [aviso, setAviso] = useState('')

    function localEscolhido(posicao: [number, number]) {
        setPosicaoEscolhida(posicao)
        setEscolhendoLocal(false)
        setMostrarFormulario(true)
    }

    function fecharFormulario() {
        setMostrarFormulario(false)
        setPosicaoEscolhida(null)
        setTitulo('')
        setTipo('')
        setDescricao('')
        setImagem('')
        setMensagemErro('')
    }

    async function enviarDenuncia(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        setMensagemErro('')

        if (!posicaoEscolhida) {
            setMensagemErro('Escolha o local no mapa.')
            return
        }

        const usuario = JSON.parse(localStorage.getItem('arbo-usuario') ?? '{}')

        try {
            const resposta = await fetch(`${API_URL}/ocorrencias`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titulo: titulo,
                    tipo: tipo,
                    descricao: descricao,
                    imagem: imagem || null,
                    latitude: Number(posicaoEscolhida[0].toFixed(7)),
                    longitude: Number(posicaoEscolhida[1].toFixed(7)),
                    usuarioId: usuario.id,
                }),
            })

            if (!resposta.ok) {
                const corpo = await resposta.json()

                const erroDeCampo = corpo.campos ? Object.values(corpo.campos)[0] : null
                setMensagemErro(String(erroDeCampo ?? corpo.erro ?? 'Não foi possível registrar.'))
                return
            }

            const nova = await resposta.json()

            setOcorrencias((atuais) => [...atuais, nova])

            fecharFormulario()
            setAviso('Denúncia registrada com sucesso!')
            setTimeout(() => setAviso(''), 3000)
        } catch (erro) {
            console.error('Erro ao registrar denúncia: ', erro)
            setMensagemErro('Não foi possível conectar ao servidor.')
        }
    }

    const ocorrenciasFiltradas = useMemo(
        () =>
            ocorrencias.filter((ocorrencia) =>
                `${ocorrencia.titulo} ${ocorrencia.tipo} ${ocorrencia.status}`
                    .toLowerCase()
                    .includes(pesquisa.toLowerCase())
            ),
        [ocorrencias, pesquisa]
    )

    return (
        <main className="pagina-mapa">
            {/* Pesquisa original */}
            <input
                className="pesquisa-mapa"
                type="text"
                placeholder="Buscar local ou ocorrência..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
            />

            {/* Dois botões independentes */}
            <div className="controles-mapa">
                <button
                    type="button"
                    className="botao-controle-mapa"
                    onClick={() =>
                        setMostrarMarcadores((anterior) => !anterior)
                    }
                >
                    {mostrarMarcadores
                        ? 'Ocultar ocorrências'
                        : 'Mostrar ocorrências'}
                </button>

                <button
                    type="button"
                    className="botao-controle-mapa"
                    onClick={() =>
                        setModoCalor((anterior) => !anterior)
                    }
                >
                    {modoCalor
                        ? 'Ocultar mapa de calor'
                        : 'Mostrar mapa de calor'}
                </button>
            </div>

            <MapContainer
                center={[-23.531821, -46.369772]}
                zoom={13}
                className="mapa-interativo"
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <CliqueNoMapa ativo={escolhendoLocal} onClique={localEscolhido} />

                {posicaoEscolhida && (
                    <CircleMarker
                        center={posicaoEscolhida}
                        radius={11}
                        pathOptions={{ color: '#202820', dashArray: '4', fillOpacity: 0.15 }}
                    />
                )}

                {/* Camada de temperatura do Landsat */}
                {modoCalor && <MapaCalor />}

                {/* Ocorrências originais */}
                {mostrarMarcadores &&
                    ocorrenciasFiltradas.map((ocorrencia) => (
                        <CircleMarker
                            key={ocorrencia.id}
                            center={[ocorrencia.latitude, ocorrencia.longitude]}
                            radius={9}
                            pathOptions={{
                                color: obterCor(ocorrencia.status),
                                fillColor: obterCor(ocorrencia.status),
                                fillOpacity: 0.9
                            }}
                        >
                            <Popup>
                                <div className="conteudo-popup">
                                    {ocorrencia.imagem && (
                                        <img
                                            src={ocorrencia.imagem}
                                            alt={ocorrencia.titulo}
                                            className="imagem-ocorrencia"
                                        />
                                    )}

                                    <strong>{ocorrencia.titulo}</strong>

                                    <p>Tipo: {ocorrencia.tipo}</p>
                                    <p>Status: {ocorrencia.status}</p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}

                {/* Legenda de ocorrências */}
                {!modoCalor && mostrarMarcadores && (
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
                )}

                {/* Legenda do mapa térmico */}
                {modoCalor && (
                    <div className="legenda-mapa">
                        <strong>Temperatura da superfície</strong>

                        <div className="item-legenda">
                            <span
                                className="bolinha-legenda"
                                style={{ backgroundColor: '#2455A4' }}
                            ></span>
                            <span>Mais fria</span>
                        </div>

                        <div className="item-legenda">
                            <span
                                className="bolinha-legenda"
                                style={{ backgroundColor: '#38A6C8' }}
                            ></span>
                            <span>Fria</span>
                        </div>

                        <div className="item-legenda">
                            <span
                                className="bolinha-legenda"
                                style={{ backgroundColor: '#2B8A48' }}
                            ></span>
                            <span>Intermediária</span>
                        </div>

                        <div className="item-legenda">
                            <span
                                className="bolinha-legenda"
                                style={{ backgroundColor: '#E9B949' }}
                            ></span>
                            <span>Quente</span>
                        </div>

                        <div className="item-legenda">
                            <span
                                className="bolinha-legenda"
                                style={{ backgroundColor: '#D94A4A' }}
                            ></span>
                            <span>Muito quente</span>
                        </div>

                        <small>Temperatura de superfície — Landsat 2025</small>
                    </div>
                )}
            </MapContainer>
            {aviso && (
                <p className="mensagem-formulario sucesso aviso-mapa">{aviso}</p>
            )}

            {escolhendoLocal ? (
                <div className="aviso-escolher-local">
                    Toque no mapa para marcar o local
                    <button type="button" onClick={() => setEscolhendoLocal(false)}>
                        Cancelar
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    className="botao-nova-denuncia"
                    onClick={() => setEscolhendoLocal(true)}
                >
                    + Nova Denúncia
                </button>
            )}

            {mostrarFormulario && (
                <div className="fundo-modal">
                    <div className="modal-denuncia">
                        <button type="button" className="fechar-modal" onClick={fecharFormulario}>
                            ×
                        </button>

                        <h2>Nova Denúncia</h2>
                        <p>Registre uma ocorrência ambiental.</p>

                        <form onSubmit={enviarDenuncia}>
                            {mensagemErro && (
                                <p className="mensagem-formulario erro">{mensagemErro}</p>
                            )}

                            <label>Título</label>
                            <input
                                type="text"
                                placeholder="Ex.: Lixo acumulado na calçada"
                                maxLength={100}
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />

                            <label>Tipo de ocorrência</label>
                            <select required value={tipo} onChange={(e) => setTipo(e.target.value)}>
                                <option value="" disabled>Selecione o tipo</option>
                                <option value="DESCARTE_IRREGULAR">Descarte irregular</option>
                                <option value="QUEIMADA">Queimada</option>
                                <option value="DESMATAMENTO">Desmatamento</option>
                                <option value="ABANDONO">Abandono de área verde</option>
                            </select>

                            <label>Descrição</label>
                            <textarea
                                placeholder="Descreva o problema encontrado..."
                                maxLength={500}
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                required
                            />

                            <label>Link da foto (opcional)</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={imagem}
                                onChange={(e) => setImagem(e.target.value)}
                            />

                            <label>Localização</label>
                            <p>
                                {posicaoEscolhida
                                    ? `${posicaoEscolhida[0].toFixed(5)}, ${posicaoEscolhida[1].toFixed(5)}`
                                    : 'Nenhum local escolhido'}
                            </p>

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

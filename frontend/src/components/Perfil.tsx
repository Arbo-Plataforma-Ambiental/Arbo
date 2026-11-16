import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Perfil.css'
import LogoArbo from './LogoArbo'
import RodapeNav from './RodapeNav'
import { ocorrencias } from '../data/ocorrencias'

type DadosPerfil = {
    nome: string
    email: string
}

type ModalAberto = 'editar' | 'denuncias' | 'mutiroes' | 'sair' | null

type ModalPerfilProps = {
    aberto: boolean
    titulo: string
    descricao: string
    onFechar: () => void
    children: ReactNode
}

type OpcaoPerfilProps = {
    icone: ReactNode
    rotulo: string
    contagem?: number
    perigo?: boolean
    onClick: () => void
}

// O login ainda não cria uma sessão, então os dados editados ficam só neste navegador.
const CHAVE_PERFIL = 'arbo-perfil'

const PERFIL_PADRAO: DadosPerfil = {
    nome: 'Arborizante',
    email: 'arborizante@arbo.com',
}

// Dados de exemplo: substituir pela API quando o backend expuser o histórico do usuário.
const MEMBRO_DESDE = 'março de 2026'
const NIVEL = 3
const ARVORES_PLANTADAS = 12

const MUTIROES_PARTICIPADOS = [
    {
        id: 1,
        titulo: 'Plantio na Praça Central',
        organizacao: 'SOS Mata Atlântica',
        data: '2026-09-20',
    },
    {
        id: 2,
        titulo: 'Limpeza do Parque Linear',
        organizacao: 'Instituto Socioambiental',
        data: '2026-07-11',
    },
    {
        id: 3,
        titulo: 'Plantio em Ferraz de Vasconcelos',
        organizacao: 'SOS Mata Atlântica',
        data: '2026-04-25',
    },
]

const CONQUISTAS = [
    { emoji: '🌱', titulo: 'Primeiro passo', descricao: 'Primeira denúncia registrada' },
    { emoji: '🌳', titulo: 'Guardião verde', descricao: 'Participou de 3 mutirões' },
    { emoji: '🔥', titulo: 'Vigilante', descricao: 'Teve denúncias verificadas' },
]

const ROTULO_STATUS: Record<string, string> = {
    PENDENTE: 'Pendente',
    APROVADA: 'Aprovada',
    RECUSADA: 'Recusada',
    RESOLVIDA: 'Resolvida',
}

const ICONES = {
    pessoa: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
        </svg>
    ),
    alerta: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4 2.5 20h19L12 4z" />
            <path d="M12 10v4.5M12 17.5v.01" />
        </svg>
    ),
    grupo: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    folha: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 18C3 10 9 4 20 4c1 11-5 17-14 14z" />
            <path d="M4 21c2-5 5-8 10-11" />
        </svg>
    ),
    pino: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21z" />
            <circle cx="12" cy="9.5" r="2.5" />
        </svg>
    ),
    arvore: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3l5 7h-2.5l4 6H5.5l4-6H7l5-7z" />
            <path d="M12 16v5" />
        </svg>
    ),
    lapis: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3z" />
            <path d="M14 8l3 3" />
        </svg>
    ),
    sair: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
            <path d="M15 8l4 4-4 4M19 12H9" />
        </svg>
    ),
    fechar: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
        </svg>
    ),
    seta: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
        </svg>
    ),
}


function carregarPerfil(): DadosPerfil {
    try {
        const salvo = localStorage.getItem('arbo-usuario')
        return salvo ? JSON.parse(salvo) : PERFIL_PADRAO
    } catch {
        return PERFIL_PADRAO
    }
}

function formatarData(data: string) {
    return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

// Usa o <dialog> nativo, que já cuida do foco, da tecla Esc e do fundo escurecido.
function ModalPerfil({ aberto, titulo, descricao, onFechar, children }: ModalPerfilProps) {
    const dialogo = useRef<HTMLDialogElement>(null)
    const idTitulo = useId()

    useEffect(() => {
        const elemento = dialogo.current

        if (aberto && !elemento?.open) {
            elemento?.showModal()
        } else if (!aberto && elemento?.open) {
            elemento.close()
        }
    }, [aberto])

    return (
        <dialog
            ref={dialogo}
            className="modal-perfil"
            aria-labelledby={idTitulo}
            onClose={onFechar}
            onClick={(evento) => {
                // O clique só chega no próprio <dialog> quando acontece no fundo escurecido.
                if (evento.target === evento.currentTarget) {
                    onFechar()
                }
            }}
        >
            <div className="interior-modal">
                <div className="topo-modal">
                    <div>
                        <h2 id={idTitulo}>{titulo}</h2>
                        <p>{descricao}</p>
                    </div>

                    <button
                        type="button"
                        className="fechar-modal-perfil"
                        aria-label="Fechar"
                        onClick={onFechar}
                    >
                        {ICONES.fechar}
                    </button>
                </div>

                {children}
            </div>
        </dialog>
    )
}

function OpcaoPerfil({ icone, rotulo, contagem, perigo = false, onClick }: OpcaoPerfilProps) {
    return (
        <button
            type="button"
            className={perigo ? 'opcao-perfil perigo' : 'opcao-perfil'}
            onClick={onClick}
        >
            <span className="icone-perfil">{icone}</span>
            <span className="rotulo-opcao">{rotulo}</span>
            {contagem !== undefined && <span className="contador-opcao">{contagem}</span>}
            <span className="seta-opcao">{ICONES.seta}</span>
        </button>
    )
}

function Perfil() {
    const navegar = useNavigate()
    const [perfil, setPerfil] = useState(carregarPerfil)
    const [rascunho, setRascunho] = useState(perfil)
    const [modal, setModal] = useState<ModalAberto>(null)
    const [busca, setBusca] = useState('')

    function fecharModal() {
        setModal(null)
    }

    function abrirEdicao() {
        setRascunho(perfil)
        setModal('editar')
    }

    function salvarDados(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()

        const dados = {
            nome: rascunho.nome.trim(),
            email: rascunho.email.trim(),
        }

        setPerfil(dados)
        fecharModal()
        localStorage.setItem(CHAVE_PERFIL, JSON.stringify(dados))
    }

    function buscarNoMapa(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()

        const termo = busca.trim()
        navegar(termo ? `/mapa?busca=${encodeURIComponent(termo)}` : '/mapa')
    }

    const estatisticas = [
        { rotulo: 'Denúncias', valor: ocorrencias.length, icone: ICONES.alerta },
        { rotulo: 'Mutirões', valor: MUTIROES_PARTICIPADOS.length, icone: ICONES.grupo },
        { rotulo: 'Árvores', valor: ARVORES_PLANTADAS, icone: ICONES.folha },
    ]

    return (
        <main className="pagina-perfil">
            <header className="cabecalho-perfil">
                <div className="marca-perfil">
                    <span className="logo-perfil">
                        <LogoArbo />
                    </span>
                    <span>Arbo</span>
                </div>

                <form className="busca-perfil" role="search" onSubmit={buscarNoMapa}>
                    <input
                        type="search"
                        placeholder="Buscar local ou ocorrência..."
                        aria-label="Buscar local ou ocorrência no mapa"
                        value={busca}
                        onChange={(evento) => setBusca(evento.target.value)}
                    />
                </form>

                <button
                    type="button"
                    className="avatar-cabecalho"
                    aria-label="Editar meus dados"
                    onClick={abrirEdicao}
                >
                    {ICONES.pessoa}
                </button>
            </header>

            <section className="faixa-perfil">
                <div className="limite-perfil">
                    <h1>Meu Perfil</h1>

                    <div className="identificacao-perfil">
                        <div className="avatar-perfil">{ICONES.pessoa}</div>

                        <div className="informacoes-usuario">
                            <h2>{perfil.nome}</h2>
                            <p>{perfil.email}</p>
                            <p>Membro desde {MEMBRO_DESDE}</p>

                            <div className="selos-perfil">
                                <span>Cidadão</span>
                                <span>Nível {NIVEL}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="conteudo-perfil limite-perfil">
                <ul className="estatisticas-perfil">
                    {estatisticas.map((item) => (
                        <li key={item.rotulo}>
                            <span className="icone-perfil">{item.icone}</span>
                            <strong>{item.valor}</strong>
                            <span>{item.rotulo}</span>
                        </li>
                    ))}
                </ul>

                <section className="secao-conquistas" aria-labelledby="titulo-conquistas">
                    <h2 id="titulo-conquistas">Conquistas recentes</h2>

                    <ul className="lista-conquistas">
                        {CONQUISTAS.map((conquista) => (
                            <li className="cartao-conquista" key={conquista.titulo}>
                                <span className="emoji-conquista" aria-hidden="true">
                                    {conquista.emoji}
                                </span>
                                <strong>{conquista.titulo}</strong>
                                <p>{conquista.descricao}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                <div className="opcoes-perfil">
                    <OpcaoPerfil
                        icone={ICONES.pino}
                        rotulo="Minhas denúncias"
                        contagem={ocorrencias.length}
                        onClick={() => setModal('denuncias')}
                    />
                    <OpcaoPerfil
                        icone={ICONES.arvore}
                        rotulo="Mutirões participados"
                        contagem={MUTIROES_PARTICIPADOS.length}
                        onClick={() => setModal('mutiroes')}
                    />
                    <OpcaoPerfil
                        icone={ICONES.lapis}
                        rotulo="Editar meus dados"
                        onClick={abrirEdicao}
                    />
                    <OpcaoPerfil
                        icone={ICONES.sair}
                        rotulo="Sair da conta"
                        perigo
                        onClick={() => setModal('sair')}
                    />
                </div>
            </div>

            <ModalPerfil
                aberto={modal === 'editar'}
                titulo="Editar meus dados"
                descricao="Essas informações aparecem no seu perfil."
                onFechar={fecharModal}
            >
                <form className="formulario-perfil" onSubmit={salvarDados}>
                    <div className="campo-perfil">
                        <label htmlFor="nome-perfil">Nome</label>
                        <input
                            type="text"
                            id="nome-perfil"
                            autoComplete="name"
                            maxLength={100}
                            pattern=".*\S.*"
                            title="Informe o seu nome"
                            value={rascunho.nome}
                            onChange={(evento) =>
                                setRascunho({ ...rascunho, nome: evento.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="campo-perfil">
                        <label htmlFor="email-perfil">E-mail</label>
                        <input
                            type="email"
                            id="email-perfil"
                            autoComplete="email"
                            maxLength={150}
                            value={rascunho.email}
                            onChange={(evento) =>
                                setRascunho({ ...rascunho, email: evento.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="acoes-modal">
                        <button
                            type="button"
                            className="botao-perfil secundario"
                            onClick={fecharModal}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="botao-perfil">
                            Salvar
                        </button>
                    </div>
                </form>
            </ModalPerfil>

            <ModalPerfil
                aberto={modal === 'denuncias'}
                titulo="Minhas denúncias"
                descricao="Acompanhe o andamento das ocorrências que você registrou."
                onFechar={fecharModal}
            >
                <ul className="lista-modal">
                    {ocorrencias.map((ocorrencia) => (
                        <li className="item-modal" key={ocorrencia.id}>
                            <img src={ocorrencia.imagem} alt="" loading="lazy" />

                            <div>
                                <strong>{ocorrencia.titulo}</strong>
                                <span className={`status-denuncia ${ocorrencia.status.toLowerCase()}`}>
                                    {ROTULO_STATUS[ocorrencia.status]}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="acoes-modal">
                    <Link to="/mapa" className="botao-perfil">
                        Ver no mapa
                    </Link>
                </div>
            </ModalPerfil>

            <ModalPerfil
                aberto={modal === 'mutiroes'}
                titulo="Mutirões participados"
                descricao="As ações de que você já fez parte."
                onFechar={fecharModal}
            >
                <ul className="lista-modal">
                    {MUTIROES_PARTICIPADOS.map((mutirao) => (
                        <li className="item-modal" key={mutirao.id}>
                            <span className="icone-perfil">{ICONES.arvore}</span>

                            <div>
                                <strong>{mutirao.titulo}</strong>
                                <small>
                                    {mutirao.organizacao} • {formatarData(mutirao.data)}
                                </small>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="acoes-modal">
                    <Link to="/ongs" className="botao-perfil">
                        Ver próximos mutirões
                    </Link>
                </div>
            </ModalPerfil>

            <ModalPerfil
                aberto={modal === 'sair'}
                titulo="Sair da conta?"
                descricao="Você voltará para a tela de login."
                onFechar={fecharModal}
            >
                <div className="acoes-modal">
                    <button
                        type="button"
                        className="botao-perfil secundario"
                        onClick={fecharModal}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="botao-perfil perigo"
                        onClick={() => {
                            localStorage.removeItem('arbo-usuario')
                            navegar('/', { replace: true })
                        }}                    >
                        Sair
                    </button>
                </div>
            </ModalPerfil>

            <RodapeNav />
        </main>
    )
}

export default Perfil

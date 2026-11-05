import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Ongs.css'
import LogoArbo from './LogoArbo'
import RodapeNav from './RodapeNav'

type Mutirao = {
  id: number
  titulo: string
  data: string
  horario: string
  localizacao: string
  organizacao: string
  confirmados: number
}

type Ong = {
  id: number
  nome: string
  descricao: string
  localizacao: string
  site: string
  denunciasAuditadas: number
  mutiroesRealizados: number
  apoiadores: number
}

// Dados de exemplo: substituir pela API quando o backend expuser ONGs e mutirões.
const MUTIROES: Mutirao[] = [
  {
    id: 1,
    titulo: 'Mutirão de Plantio - Parque Linear',
    data: '2026-12-13',
    horario: '08:00',
    localizacao: 'Parque Linear, Ferraz de Vasconcelos',
    organizacao: 'SOS Mata Atlântica',
    confirmados: 244,
  },
  {
    id: 2,
    titulo: 'Mutirão de Plantio - Ferraz de Vasconcelos',
    data: '2027-01-18',
    horario: '09:30',
    localizacao: 'Centro, Ferraz de Vasconcelos',
    organizacao: 'Instituto Socioambiental',
    confirmados: 7,
  },
]

const ONGS: Ong[] = [
  {
    id: 1,
    nome: 'SOS Mata Atlântica',
    descricao: 'Organização dedicada à conservação da Mata Atlântica e seus ecossistemas.',
    localizacao: 'São Paulo, SP',
    site: 'https://www.sosma.org.br',
    denunciasAuditadas: 847,
    mutiroesRealizados: 34,
    apoiadores: 12000,
  },
  {
    id: 2,
    nome: 'Instituto Socioambiental',
    descricao: 'Organização que defende bens e direitos sociais, ambientais e culturais.',
    localizacao: 'São Paulo, SP',
    site: 'https://www.socioambiental.org',
    denunciasAuditadas: 312,
    mutiroesRealizados: 19,
    apoiadores: 5400,
  },
]

function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

function formatarData(data: string) {
  return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function Ongs() {
  const [busca, setBusca] = useState('')
  const [inscricoes, setInscricoes] = useState<number[]>([])
  const [seguindo, setSeguindo] = useState<number[]>([])

  const termo = normalizar(busca.trim())

  const mutiroes = MUTIROES.filter((mutirao) =>
    normalizar(`${mutirao.titulo} ${mutirao.organizacao} ${mutirao.localizacao}`).includes(termo),
  )

  const ongs = ONGS.filter((ong) =>
    normalizar(`${ong.nome} ${ong.descricao} ${ong.localizacao}`).includes(termo),
  )

  function alternarSeguir(id: number) {
    setSeguindo((atual) =>
      atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id],
    )
  }

  return (
    <main className="pagina-ongs">
      <header className="cabecalho-ongs">
        <div className="marca-ongs">
          <span className="logo-ongs">
            <LogoArbo />
          </span>
          <span>Arbo</span>
        </div>

        <input
          type="search"
          placeholder="Buscar ONG ou mutirão..."
          aria-label="Buscar ONG, mutirão ou local"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
        />

        <Link to="/perfil" className="avatar-ongs" aria-label="Ir para o perfil">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
          </svg>
        </Link>
      </header>

      <section className="titulo-ongs">
        <div className="limite-ongs">
          <h1>ONGs Parceiras</h1>
          <p>Conheça as organizações que transformam denúncias em ações.</p>
        </div>
      </section>

      <div className="conteudo-ongs">
        <section className="secao-mutiroes" aria-labelledby="titulo-mutiroes">
          <div className="limite-ongs">
            <h2 id="titulo-mutiroes">Próximos mutirões</h2>

            {mutiroes.length > 0 ? (
              <ul className="lista-mutiroes">
                {mutiroes.map((mutirao) => {
                  const inscrito = inscricoes.includes(mutirao.id)
                  const confirmados = mutirao.confirmados + (inscrito ? 1 : 0)

                  return (
                    <li className="cartao-mutirao" key={mutirao.id}>
                      <div className="topo-mutirao">
                        <span className="icone-mutirao">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M3 10h18M8 3v4M16 3v4" />
                          </svg>
                        </span>
                        <span className="data-mutirao">
                          {formatarData(mutirao.data)} • {mutirao.horario}
                        </span>
                      </div>

                      <h3>{mutirao.titulo}</h3>
                      <p className="organizacao-mutirao">{mutirao.organizacao}</p>

                      <p className="local-ongs">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21z" />
                          <circle cx="12" cy="9.5" r="2.5" />
                        </svg>
                        {mutirao.localizacao}
                      </p>

                      <div className="rodape-mutirao">
                        <span className="confirmados-mutirao">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          {confirmados} confirmados
                        </span>

                        <button
                          type="button"
                          className="botao-participar"
                          disabled={inscrito}
                          onClick={() => setInscricoes((atual) => [...atual, mutirao.id])}
                        >
                          {inscrito ? 'Inscrito' : 'Participar'}
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="vazio-ongs">Nenhum mutirão encontrado para essa busca.</p>
            )}
          </div>
        </section>

        <section className="secao-organizacoes" aria-labelledby="titulo-organizacoes">
          <div className="limite-ongs">
            <h2 id="titulo-organizacoes">Organizações</h2>

            {ongs.length > 0 ? (
              <ul className="lista-organizacoes">
                {ongs.map((ong) => {
                  const segue = seguindo.includes(ong.id)

                  return (
                    <li className="cartao-organizacao" key={ong.id}>
                      <div className="identificacao-organizacao">
                        <span className="icone-organizacao">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 3l5 7h-2.5l4 6H5.5l4-6H7l5-7z" />
                            <path d="M12 16v5" />
                          </svg>
                        </span>

                        <div>
                          <h3>{ong.nome}</h3>
                          <p className="local-ongs">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21z" />
                              <circle cx="12" cy="9.5" r="2.5" />
                            </svg>
                            {ong.localizacao}
                          </p>
                        </div>
                      </div>

                      <p className="descricao-organizacao">{ong.descricao}</p>

                      <dl className="estatisticas-organizacao">
                        <div>
                          <dd>{ong.denunciasAuditadas.toLocaleString('pt-BR')}</dd>
                          <dt>Denúncias auditadas</dt>
                        </div>
                        <div>
                          <dd>{ong.mutiroesRealizados.toLocaleString('pt-BR')}</dd>
                          <dt>Mutirões realizados</dt>
                        </div>
                        <div>
                          <dd>{ong.apoiadores.toLocaleString('pt-BR')}</dd>
                          <dt>Apoiadores</dt>
                        </div>
                      </dl>

                      <div className="acoes-organizacao">
                        <button
                          type="button"
                          className={segue ? 'botao-seguir seguindo' : 'botao-seguir'}
                          aria-pressed={segue}
                          onClick={() => alternarSeguir(ong.id)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 20s-7.5-4.6-9-9.3C2 7.4 4.2 5 7 5c2 0 3.8 1 5 3 1.2-2 3-3 5-3 2.8 0 5 2.4 4 5.7-1.5 4.7-9 9.3-9 9.3z" />
                          </svg>
                          {segue ? 'Seguindo' : 'Seguir'}
                        </button>

                        <a
                          className="botao-site"
                          href={ong.site}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Abrir o site de ${ong.nome}`}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M14 4h6v6M20 4l-9 9" />
                            <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                          </svg>
                        </a>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="vazio-ongs">Nenhuma organização encontrada para essa busca.</p>
            )}
          </div>
        </section>
      </div>

      <RodapeNav />
    </main>
  )
}

export default Ongs

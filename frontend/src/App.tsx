
import './App.css'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import FormularioLogin from './components/FormularioLogin'
import LogoArbo from './components/LogoArbo'
import Perfil from './components/Perfil'

function TelaLogin({ onEntrar }: { onEntrar: () => void }) {
  return (
    <main className="pagina-login">
      <aside className="painel-marca">
        <a className="marca" href="#inicio" aria-label="Arbo - início">
          <LogoArbo />
          <span>Arbo</span>
        </a>

        <div className="mensagem-marca">
          <span className="texto-destaque">NATUREZA EM MOVIMENTO</span>

          <h1>
            Mais áreas verdes.
            <br />
            <span>Um futuro melhor.</span>
          </h1>

          <p>
            Conectamos pessoas, tecnologia e natureza para preservar
            o que realmente importa.
          </p>
        </div>

        <div className="rodape-marca">
          <span>Juntos por cidades mais verdes.</span>
        </div>
      </aside>

      <section className="area-login">
        <div className="cartao-login">
          <div className="marca-celular">
            <span className="icone-folha-celular">❧</span>
            <span>arbo</span>
          </div>

          <div className="cabecalho-login">
            <span className="rotulo-boas-vindas">
              BEM-VINDO DE VOLTA
            </span>

            <h2>Bom ter você por aqui.</h2>

            <p>
              Entre na sua conta e faça parte da transformação
              dos espaços verdes.
            </p>
          </div>

          <FormularioLogin onEntrar={onEntrar} />

          <div className="nota-login">
            <span />
            <p>Pequenas ações. Grandes mudanças.</p>
            <span />
          </div>
        </div>

        <p className="rodape-area-login">
          Cuidar do verde é cuidar do nosso futuro.
        </p>
      </section>
    </main>
  )
}

function TelaMapa() {
  return (
    <div>
      <h1>Mapa do Arbo</h1>
      <p>em desenvolvimento.</p>
    </div>
  )
}

function TelaOngs() {
  return (
    <div>
      <h1>ONGs</h1>
      <p>Em desenvolvimento</p>
    </div>
  )
}

function App() {
  const navegar = useNavigate()

  return (
    <Routes>
      <Route
        path="/"
        element={
          <TelaLogin onEntrar={() => navegar('/perfil')} />
        }
      />

      <Route path="/perfil" element={<Perfil />} />
      <Route path="/mapa" element={<TelaMapa />} />
      <Route path="/ongs" element={<TelaOngs />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

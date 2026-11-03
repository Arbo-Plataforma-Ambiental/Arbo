
import { useState } from "react"

type FormularioLoginProps = {
  onEntrar: () => void
}

function FormularioLogin({ onEntrar }: FormularioLoginProps) {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [modoCadastro, setModoCadastro] = useState(false)
  const [nome, setNome] = useState("")


  async function lidarComEnvio(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault()

    if (modoCadastro) {
      try {
        const resposta = await fetch(
          "http://localhost:8080/usuarios",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nome: nome,
              email: email,
              senha: senha,
              tipo: "CIDADAO",
            }),
          }
        )

        if (!resposta.ok) {
          throw new Error("Não foi possível cadstrar o usuário.");
        }

        alert("Cadastro realizado com sucesso.")

        setNome("")
        setEmail("")
        setSenha("")
        setModoCadastro(false)

      } catch (erro) {
        console.error("Errona no cadastro: ", erro)
        alert("Não foi possível realizar o cadastro. Verifique se o e - mail já está cadastrado")
      }
      return
    }

    onEntrar()

  }



  return (
    <>
      <form
        className="formulario-login"
        onSubmit={lidarComEnvio}
      >

        {modoCadastro && (
          <div className="grupo-campo">
            <label htmlFor="nome">Nome completo</label>
            <input
              type="text"
              id="nome"
              placeholder="Seu nome completo"
              autoComplete="name"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
              required
            />
          </div>
        )}
        <div className="grupo-campo">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            placeholder="seu@email.com"
            autoComplete="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            required
          />
        </div>

        <div className="grupo-campo">
          <div className="linha-rotulo">
            <label htmlFor="senha">Senha</label>
            <a href="#recuperar-senha">Esqueceu a senha?</a>
          </div>

          <input
            type="password"
            id="senha"
            placeholder="Digite sua senha"
            autoComplete="current-password"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            required
          />
        </div>

        <button type="submit" className="botao-entrar">
          {modoCadastro ? "Criar minha conta" : "Entrar na minha conta"}
          <span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="texto-cadastro">
        {modoCadastro
          ? "Já tem uma conta? "
          : "Ainda não tem uma conta? "}

        <a
          href="#cadastro"
          onClick={(evento) => {
            evento.preventDefault()
            setModoCadastro(!modoCadastro)
          }}
        >
          {modoCadastro ? "Entrar" : "Cadastre-se"}
        </a>
      </p>
    </>
  )
}

export default FormularioLogin

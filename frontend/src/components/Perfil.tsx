import './Perfil.css'
import RodapeNav from './RodapeNav'


function Perfil() {
    return (
        <main className="pagina-perfil">

            <header className="cabecalho-perfil">
                <div className="marca-perfil">
                    <span>Arbo</span>
                </div>

                <input
                    type="search"
                    placeholder="Buscar..."
                    aria-label="Buscar"
                />
            </header>


            <section className="conteudo-perfil">

                <h1>Meu Perfil</h1>


                <div className="cartao-identificacao">
                    <div className="avatar-perfil">
                        <span>👤</span>
                    </div>

                    <div className="informacoes-usuario">
                        <h2>Arborizante</h2>
                        <p>Membro Arbo</p>
                        <span className="tipo-conta">Cidadão</span>
                    </div>
                </div>


                <div className="opcoes-perfil">

                    <button className="opcao-perfil">
                        <span>⚙️</span>
                        <span>Editar meus dados</span>
                        <span>›</span>
                    </button>

                    <button className="opcao-perfil">
                        <span>🌳</span>
                        <span>Minhas ocorrências</span>
                        <span>›</span>
                    </button>

                    <button className="opcao-perfil">
                        <span>🚪</span>
                        <span>Sair da conta</span>
                        <span>›</span>
                    </button>

                </div>

            </section>


            <RodapeNav />

        </main>
    )
}

export default Perfil

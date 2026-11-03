# Arbo — Plataforma Ambiental

Projeto Integrador do curso de **Análise e Desenvolvimento de Sistemas — Fatec Ferraz de Vasconcelos**, disciplina de Programação Web.

## Sobre o projeto

O **Arbo** é uma plataforma que conecta cidadãos, ONGs e órgãos públicos para cuidar do meio ambiente da cidade.

- **Cidadãos** registram ocorrências ambientais (ex.: foco de dengue, descarte irregular de lixo), com descrição e localização.
- **ONGs e órgãos públicos** organizam mutirões para resolver esses problemas.
- **Usuários** podem se inscrever para participar dos mutirões.

## Integrantes

| Nome | GitHub |
|---|---|
| Thiago Ribeiro | [@thiagoConsta](https://github.com/thiagoConsta) |
| Murilo Magalhães | [@MuriloMgl](https://github.com/MuriloMgl) |
| Felipe Martins | [@felipekntz](https://github.com/felipekntz) |

## Tecnologias

- **Back-end:** Java 21, Spring Boot, Spring Data JPA, Maven
- **Banco de dados:** MySQL
- **Front-end:** React
- **Versionamento:** Git e GitHub

## Estrutura do back-end

O back-end segue a arquitetura em camadas (MVC):

```
backend/arbo-backend/src/main/java/com/arbo/arbo/backend/
├── controller/   → recebe as requisições HTTP (endpoints da API)
├── service/      → regras de negócio
├── repository/   → acesso ao banco de dados
└── model/        → entidades (Usuario, Ocorrencia)
```

## Endpoints da API

### Usuários

| Método | Rota | Descrição |
|---|---|---|
| GET | `/usuarios` | Lista todos os usuários |
| GET | `/usuarios/{id}` | Busca um usuário pelo id |
| POST | `/usuarios` | Cadastra um usuário |
| PUT | `/usuarios/{id}` | Atualiza um usuário |
| DELETE | `/usuarios/{id}` | Exclui um usuário |

### Ocorrências

| Método | Rota | Descrição |
|---|---|---|
| GET | `/ocorrencias` | Lista todas as ocorrências |
| GET | `/ocorrencias/{id}` | Busca uma ocorrência pelo id |
| POST | `/ocorrencias` | Registra uma ocorrência |
| PUT | `/ocorrencias/{id}` | Atualiza uma ocorrência |
| DELETE | `/ocorrencias/{id}` | Exclui uma ocorrência |

## Como executar o back-end

**Pré-requisitos:** Java 21 e MySQL instalados.

1. Crie o banco rodando o script `backend/banco/arbo.sql` no MySQL.
2. Em `backend/arbo-backend/src/main/resources/application.properties`, coloque o usuário e a senha do seu MySQL.
3. No terminal, dentro da pasta `backend/arbo-backend`, rode:
   - Windows: `mvnw.cmd spring-boot:run`
   - Linux/Mac: `./mvnw spring-boot:run`
4. A API fica disponível em `http://localhost:8080`.

## Links

- **API publicada:** em breve
- **Front-end publicado:** em breve
- **Documentação Swagger:** em breve

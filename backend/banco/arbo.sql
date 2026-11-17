CREATE DATABASE IF NOT EXISTS arbo;
USE arbo;

CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS ocorrencia (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    imagem VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDENTE',
    data_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT NOT NULL,
    CONSTRAINT fk_ocorrencia_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS ong (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(500),
    localizacao VARCHAR(200),
    usuario_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_ong_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);


-- tabelas planejadas para as próximas etapas (ainda não utilizadas)
CREATE TABLE IF NOT EXISTS mutirao (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    localizacao VARCHAR(200) NOT NULL,
    responsavel_id BIGINT NOT NULL,
    CONSTRAINT fk_mutirao_responsavel
        FOREIGN KEY (responsavel_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS participacao (
    usuario_id BIGINT NOT NULL,
    mutirao_id BIGINT NOT NULL,
    data_participacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, mutirao_id),
    CONSTRAINT fk_participacao_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    CONSTRAINT fk_participacao_mutirao
        FOREIGN KEY (mutirao_id) REFERENCES mutirao(id)
);
USE bd_arbo;

-- TABELA USUÁRIO
CREATE TABLE usuario(
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(60) NOT NULL,
    perfil VARCHAR(30) NOT NULL,
    dataCadastro DATE
);

-- TABELA OCORRÊNCIA
CREATE TABLE ocorrencia(
    idOcorrencia INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    descricao VARCHAR(300) NOT NULL,
    latitude VARCHAR(50) NOT NULL,
    longitude VARCHAR(50) NOT NULL,
    endereco VARCHAR(100) NOT NULL,
    statusOcorrencia VARCHAR(50) NOT NULL,
    dataRegistro DATETIME NOT NULL,
    idRegistrado INT NOT NULL,

    FOREIGN KEY (idRegistrado) 
        REFERENCES usuario(idUsuario)
);


-- TABELA ONG
CREATE TABLE ong(
    idOng INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(300) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(60) NOT NULL,
    endereco VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    idUsuario INT NOT NULL,

    FOREIGN KEY (idUsuario)
        REFERENCES usuario(idUsuario)
);


-- TABELA ÓRGÃO PÚBLICO
CREATE TABLE orgaoPublico(
    idOrgaoPublico INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(300),
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(60) NOT NULL,
    endereco VARCHAR(100) NOT NULL,
    idUsuario INT NOT NULL,

    FOREIGN KEY (idUsuario)
        REFERENCES usuario(idUsuario)
);


-- TABELA MUTIRÃO
CREATE TABLE mutirao(
    idMutirao INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    descricao VARCHAR(300) NOT NULL,
    endereco VARCHAR(100) NOT NULL,
    dataMutirao DATE NOT NULL,
    horario TIME NOT NULL,
    vagas INT NOT NULL,
    statusMutirao VARCHAR(50) NOT NULL,
    idOng INT,
    idOrgaoPublico INT,

    FOREIGN KEY (idOng)
        REFERENCES ong(idOng),

    FOREIGN KEY (idOrgaoPublico)
        REFERENCES orgaoPublico(idOrgaoPublico)
);


-- TABELA PARTICIPAÇÃO EM MUTIRÃO
CREATE TABLE participacaoMutirao(
    idParticipacao INT PRIMARY KEY AUTO_INCREMENT,
    idUsuario INT NOT NULL,
    idMutirao INT NOT NULL,
    dataInscricao DATETIME NOT NULL,

    FOREIGN KEY (idUsuario)
        REFERENCES usuario(idUsuario),

    FOREIGN KEY (idMutirao)
        REFERENCES mutirao(idMutirao)
);

INSERT INTO usuario (nome, email, senha, telefone, perfil, dataCadastro) 
VALUES ('João Silva', 'joao@email.com', 'senha123', '(11) 99999-9999', 'Cidadão', '2026-10-01'.);


INSERT INTO ocorrencia (titulo, descricao, latitude, longitude, endereco, statusOcorrencia, dataRegistro, idRegistrado)
VALUES ('Foco de Dengue', 'Água parada em terreno baldio próximo à esquina.', '-23.5489', '-46.6388', 'Rua das Flores, 123', 'Aberto', NOW(), 1);

CREATE VIEW vw_DetalhesOcorrencias AS
SELECT 
    o.idOcorrencia AS Protocolo,
    o.titulo AS Ocorrencia,
    o.descricao AS Relato,
    o.endereco AS Local_Fato,
    o.statusOcorrencia AS Status_Atual,
    o.dataRegistro AS Data_Hora,
    u.nome AS Relatado_Por,
    u.telefone AS Contato_Reporter
FROM ocorrencia o
INNER JOIN usuario u ON u.idUsuario = o.idRegistrado;

DELIMITER //

CREATE FUNCTION ContarOcorrenciasDoUsuario(usuario_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT;
    

    SELECT COUNT(*) INTO total 
    FROM ocorrencia 
    WHERE idRegistrado = usuario_id;
    
    RETURN total;
END //

DELIMITER ;

-- Tabela que vai mostrar quantas ocorrencias cada usuario tem
SELECT 
    idUsuario, 
    nome, 
    ContarOcorrenciasDoUsuario(idUsuario) AS Total_Ocorrencias 
FROM usuario;


SELECT * FROM vw_DetalhesOcorrencias;
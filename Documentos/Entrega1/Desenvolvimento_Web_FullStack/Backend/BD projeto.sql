CREATE DATABASE techfood;
USE techfood;

-- Tabela base de usuários (dados comuns a todos)
CREATE TABLE usuario (
    idUsuario     INT AUTO_INCREMENT PRIMARY KEY,
    tipoUsuario   INT NOT NULL,
    nomeUsuario   VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    senha         VARCHAR(255) NOT NULL,
    contato       VARCHAR(20),
    dataCadastro  DATETIME DEFAULT CURRENT_TIMESTAMP,
    ativo         BOOLEAN DEFAULT TRUE,
    CONSTRAINT chk_tipo CHECK (tipoUsuario IN (1, 2, 3))
);

-- Administrador
CREATE TABLE administrador (
    idAdmin     INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario   INT NOT NULL UNIQUE,
    nivelAcesso INT DEFAULT 1,
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario) ON DELETE CASCADE
);

-- Comprador
CREATE TABLE comprador (
    idComprador INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario   INT NOT NULL UNIQUE,
    cpf         CHAR(11) NOT NULL UNIQUE,
    cep         CHAR(8),
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario) ON DELETE CASCADE
);

-- Fornecedor
CREATE TABLE fornecedor (
    idFornecedor    INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario       INT NOT NULL UNIQUE,
    cnpj            CHAR(14) NOT NULL UNIQUE,
    cep             CHAR(8),
    nomeFantasia    VARCHAR(255),
    descricao       TEXT,
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario) ON DELETE CASCADE
);

-- Categoria separada da tabela anuncio
CREATE TABLE categoriaProduto (
    idCategoria  INT AUTO_INCREMENT PRIMARY KEY,
    nomeCategoria VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT
);

-- Anuncio melhorado
CREATE TABLE anuncio (
    idAnuncio    INT AUTO_INCREMENT PRIMARY KEY,
    idFornecedor INT NOT NULL,
    idCategoria  INT NOT NULL,
    titulo       VARCHAR(255) NOT NULL,
    descricao    TEXT,
    preco        DECIMAL(10, 2) NOT NULL,
    estoque      INT DEFAULT 0,
    dataCriacao  DATETIME DEFAULT CURRENT_TIMESTAMP,
    ativo        BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (idFornecedor) REFERENCES fornecedor(idFornecedor),
    FOREIGN KEY (idCategoria)  REFERENCES categoriaProduto(idCategoria)
);

CREATE TABLE avaliacao (
    idAvaliacao     INT AUTO_INCREMENT PRIMARY KEY,
    idComprador     INT NOT NULL,
    idAnuncio       INT NOT NULL,
    nota            TINYINT NOT NULL,
    comentario      TEXT,
    dataAvaliacao   DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_nota CHECK (nota BETWEEN 1 AND 5),
    CONSTRAINT uq_avaliacao UNIQUE (idComprador, idAnuncio), -- impede avaliar o mesmo anúncio duas vezes
    
    FOREIGN KEY (idComprador) REFERENCES comprador(idComprador),
    FOREIGN KEY (idAnuncio)   REFERENCES anuncio(idAnuncio)
);
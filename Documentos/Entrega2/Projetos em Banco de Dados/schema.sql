CREATE DATABASE IF NOT EXISTS techfood;
USE techfood;

-- Tabela base de usuários (dados comuns a todos)
-- senha: VARCHAR(255) suporta hash bcrypt
-- img: caminho da foto de perfil (uploads/...)
CREATE TABLE usuario (
    idUsuario     INT AUTO_INCREMENT PRIMARY KEY,
    tipoUsuario   INT NOT NULL DEFAULT 2,
    nomeUsuario   VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    senha         VARCHAR(255) NOT NULL,
    contato       VARCHAR(20),
    img           VARCHAR(255) NULL,
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
    idCategoria   INT AUTO_INCREMENT PRIMARY KEY,
    nomeCategoria VARCHAR(255) NOT NULL UNIQUE,
    descricao     TEXT
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

-- Avaliação
CREATE TABLE avaliacao (
    idAvaliacao   INT AUTO_INCREMENT PRIMARY KEY,
    idComprador   INT NOT NULL,
    idAnuncio     INT NOT NULL,
    nota          TINYINT NOT NULL,
    comentario    TEXT,
    dataAvaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_nota   CHECK (nota BETWEEN 1 AND 5),
    CONSTRAINT uq_avaliacao UNIQUE (idComprador, idAnuncio), -- impede avaliar o mesmo anúncio duas vezes
    FOREIGN KEY (idComprador) REFERENCES comprador(idComprador),
    FOREIGN KEY (idAnuncio)   REFERENCES anuncio(idAnuncio)
);

-- Inserir categorias padrão
INSERT INTO categoriaProduto (nomeCategoria, descricao) VALUES
('Nozes', 'Nozes frescas e premium de qualidade superior'),
('Castanhas', 'Castanhas de caju, castanha-do-pará e outras variedades'),
('Amêndoas', 'Amêndoas selecionadas, com e sem casca'),
('Amendoins', 'Amendoins torrados e naturais em diversas apresentações'),
('Sementes', 'Sementes de girassol, abóbora, linhaça e outras'),
('Frutas Secas', 'Passa, damasco, tâmara e outras frutas desidratadas'),
('Mix & Blends', 'Misturas especiais e blends customizados de frutos secos'),
('Raízes & Tubérculos', 'Batata, batata-doce, gengibre e outras raízes premium'),
('Cereais & Grãos', 'Arroz, quinoa, aveia e outros grãos saudáveis'),
('Óleos & Manteigas', 'Manteigas de amendoim, castanha e óleos prensados a frio');
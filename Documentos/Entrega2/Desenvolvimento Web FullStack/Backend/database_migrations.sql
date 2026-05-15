-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produto (
  idProduto INT AUTO_INCREMENT PRIMARY KEY,
  nomeProduto VARCHAR(255) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(3, 1) DEFAULT 0,
  reviews INT DEFAULT 0,
  imagem VARCHAR(255),
  emEstoque BOOLEAN DEFAULT TRUE,
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Carrinho
CREATE TABLE IF NOT EXISTS carrinho (
  idCarrinho INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT NOT NULL,
  idProduto INT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario) ON DELETE CASCADE,
  FOREIGN KEY (idProduto) REFERENCES produto(idProduto) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (idUsuario, idProduto)
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS pedido (
  idPedido INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT NOT NULL,
  totalPedido DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente',
  endereco VARCHAR(500) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  dataPedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario) ON DELETE CASCADE
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS pedido_item (
  idPedidoItem INT AUTO_INCREMENT PRIMARY KEY,
  idPedido INT NOT NULL,
  idProduto INT NOT NULL,
  quantidade INT NOT NULL,
  precoUnitario DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (idPedido) REFERENCES pedido(idPedido) ON DELETE CASCADE,
  FOREIGN KEY (idProduto) REFERENCES produto(idProduto)
);

-- Índices para melhor performance
CREATE INDEX idx_produto_categoria ON produto(categoria);
CREATE INDEX idx_carrinho_usuario ON carrinho(idUsuario);
CREATE INDEX idx_pedido_usuario ON pedido(idUsuario);
CREATE INDEX idx_pedido_status ON pedido(status);

# 🗄️ Modelagem do Banco de Dados — TechFood (Mr.Nut Marketplace B2B)

Este documento descreve a modelagem do banco de dados `techfood`, utilizado pela plataforma **Mr.Nut — Marketplace B2B** para anúncios de alimentos.

- **SGBD:** MySQL
- **Nome do banco:** `techfood`
- **Script de criação:** [`schema.sql`](./schema.sql)
- **Total de tabelas:** 7

## 📌 Visão geral

O modelo segue o padrão de **herança por especialização**: uma tabela base `usuario` armazena os dados comuns a todos os perfis, e três tabelas especializadas (`administrador`, `comprador`, `fornecedor`) estendem esses dados de acordo com o tipo de usuário. Os anúncios pertencem a fornecedores e são classificados por categoria. Compradores podem avaliar anúncios (com restrição de 1 avaliação por anúncio por comprador).

## 📑 Descrição das Tabelas

### 1. `usuario`
Tabela base com os dados comuns a todos os perfis do sistema.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| idUsuario | INT | PK, AUTO_INCREMENT | Identificador único do usuário |
| tipoUsuario | INT | NOT NULL, DEFAULT 2, CHECK IN (1,2,3) | 1=Admin, 2=Comprador, 3=Fornecedor |
| nomeUsuario | VARCHAR(255) | NOT NULL | Nome do usuário |
| email | VARCHAR(255) | NOT NULL, UNIQUE | E-mail de login |
| senha | VARCHAR(255) | NOT NULL | Hash bcrypt da senha |
| contato | VARCHAR(20) | — | Telefone/WhatsApp |
| img | VARCHAR(255) | NULL | Caminho da foto de perfil |
| dataCadastro | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data de criação da conta |
| ativo | BOOLEAN | DEFAULT TRUE | Conta ativa/inativa (soft delete) |

### 2. `administrador`
Especialização de `usuario` para perfis administradores.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| idAdmin | INT | PK, AUTO_INCREMENT | Identificador do administrador |
| idUsuario | INT | NOT NULL, UNIQUE, FK → usuario.idUsuario (ON DELETE CASCADE) | Vínculo com o usuário base |
| nivelAcesso | INT | DEFAULT 1 | Nível de permissão administrativa |

### 3. `comprador`
Especialização de `usuario` para compradores (pessoa física).

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| idComprador | INT | PK, AUTO_INCREMENT | Identificador do comprador |
| idUsuario | INT | NOT NULL, UNIQUE, FK → usuario.idUsuario (ON DELETE CASCADE) | Vínculo com o usuário base |
| cpf | CHAR(11) | NOT NULL, UNIQUE | CPF do comprador (apenas dígitos) |
| cep | CHAR(8) | — | CEP de entrega/contato |

### 4. `fornecedor`
Especialização de `usuario` para empresas fornecedoras.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| idFornecedor | INT | PK, AUTO_INCREMENT | Identificador do fornecedor |
| idUsuario | INT | NOT NULL, UNIQUE, FK → usuario.idUsuario (ON DELETE CASCADE) | Vínculo com o usuário base |
| cnpj | CHAR(14) | NOT NULL, UNIQUE | CNPJ da empresa (apenas dígitos) |
| cep | CHAR(8) | — | CEP da sede |
| nomeFantasia | VARCHAR(255) | — | Nome fantasia da empresa |
| descricao | TEXT | — | Descrição/Sobre da empresa |

### 5. `categoriaProduto`
Categorias usadas para classificar os anúncios.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| idCategoria | INT | PK, AUTO_INCREMENT | Identificador da categoria |
| nomeCategoria | VARCHAR(255) | NOT NULL, UNIQUE | Nome da categoria |
| descricao | TEXT | — | Descrição da categoria |

> O script já popula 10 categorias padrão (Nozes, Castanhas, Amêndoas, Amendoins, Sementes, Frutas Secas, Mix & Blends, Raízes & Tubérculos, Cereais & Grãos, Óleos & Manteigas).

### 6. `anuncio`
Anúncios publicados pelos fornecedores.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| idAnuncio | INT | PK, AUTO_INCREMENT | Identificador do anúncio |
| idFornecedor | INT | NOT NULL, FK → fornecedor.idFornecedor | Fornecedor responsável |
| idCategoria | INT | NOT NULL, FK → categoriaProduto.idCategoria | Categoria do produto |
| titulo | VARCHAR(255) | NOT NULL | Título do anúncio |
| descricao | TEXT | — | Descrição completa |
| preco | DECIMAL(10,2) | NOT NULL | Preço de referência |
| estoque | INT | DEFAULT 0 | Quantidade disponível |
| dataCriacao | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data de publicação |
| ativo | BOOLEAN | DEFAULT TRUE | Anúncio ativo/pausado |

### 7. `avaliacao`
Avaliações de compradores sobre anúncios.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| idAvaliacao | INT | PK, AUTO_INCREMENT | Identificador da avaliação |
| idComprador | INT | NOT NULL, FK → comprador.idComprador | Quem avaliou |
| idAnuncio | INT | NOT NULL, FK → anuncio.idAnuncio | Anúncio avaliado |
| nota | TINYINT | NOT NULL, CHECK BETWEEN 1 AND 5 | Nota de 1 a 5 |
| comentario | TEXT | — | Comentário opcional |
| dataAvaliacao | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data da avaliação |

**Constraint adicional:** `UNIQUE (idComprador, idAnuncio)` — impede que o mesmo comprador avalie o mesmo anúncio mais de uma vez.

---

## 🔑 Relacionamentos

| De | Para | Cardinalidade | Regra |
|---|---|---|---|
| usuario | administrador | 1 : 0..1 | ON DELETE CASCADE |
| usuario | comprador | 1 : 0..1 | ON DELETE CASCADE |
| usuario | fornecedor | 1 : 0..1 | ON DELETE CASCADE |
| fornecedor | anuncio | 1 : N | Um fornecedor publica vários anúncios |
| categoriaProduto | anuncio | 1 : N | Uma categoria classifica vários anúncios |
| comprador | avaliacao | 1 : N | Um comprador faz várias avaliações |
| anuncio | avaliacao | 1 : N | Um anúncio recebe várias avaliações |

---

## ▶️ Como executar

1. Conecte-se ao MySQL: `mysql -u root -p`
2. Execute o script: `SOURCE BD/schema.sql;`
3. Confirme: `USE techfood; SHOW TABLES;`
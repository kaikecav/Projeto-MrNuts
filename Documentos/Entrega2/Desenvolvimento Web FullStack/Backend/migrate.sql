-- ============================================
-- MIGRAÇÃO ENTREGA 2 - TECHFOOD
-- ============================================
-- Execute este script no MySQL Workbench para
-- atualizar o banco para a Entrega 2.
--
-- ATENÇÃO: Este script DROPA todas as tabelas
-- (incluindo dados!) e recria do zero com a
-- nova estrutura (coluna img + senhas hasheadas).
-- ============================================

USE techfood;

-- Desabilita checagem de FKs para poder dropar em qualquer ordem
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS avaliacao;
DROP TABLE IF EXISTS anuncio;
DROP TABLE IF EXISTS categoriaProduto;
DROP TABLE IF EXISTS fornecedor;
DROP TABLE IF EXISTS comprador;
DROP TABLE IF EXISTS administrador;
DROP TABLE IF EXISTS usuario;

SET FOREIGN_KEY_CHECKS = 1;

-- Recria todas as tabelas (rode em seguida o BD projeto.sql)
SOURCE BD projeto.sql;

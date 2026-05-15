-- Inserir categorias para a Mr. Nuts Marketplace
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
('Óleos & Manteigas', 'Manteigas de amendoim, castanha e óleos prensados a frio')
ON DUPLICATE KEY UPDATE nomeCategoria=VALUES(nomeCategoria);

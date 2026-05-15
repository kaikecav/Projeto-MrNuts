-- Limpar categorias anteriores e inserir as corretas
DELETE FROM categoriaProduto;

INSERT INTO categoriaProduto (nomeCategoria, descricao) VALUES
('Nozes Premium', 'Nozes de qualidade premium selecionadas'),
('Amêndoas', 'Amêndoas frescas e selecionadas'),
('Castanhas de Caju', 'Castanhas de caju de primeira qualidade'),
('Nozes', 'Nozes naturais frescas'),
('Pistachios', 'Pistachios selecionados e torrados'),
('Mix de Nozes', 'Mistura especial de nozes premium');

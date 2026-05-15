import { pool } from '../db.js';

export async function getCategorias(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM categoriaProduto ORDER BY nomeCategoria');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ erro: 'Erro ao buscar categorias' });
  }
}

export async function createCategoria(req, res) {
  const { nomeCategoria, descricao } = req.body;

  if (!nomeCategoria) {
    return res.status(400).json({ erro: 'Nome da categoria é obrigatório' });
  }

  try {
    await pool.query(
      'INSERT INTO categoriaProduto (nomeCategoria, descricao) VALUES (?, ?)',
      [nomeCategoria, descricao || null]
    );
    res.status(201).json({ mensagem: 'Categoria criada com sucesso' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ erro: 'Essa categoria já existe' });
    }
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ erro: 'Erro ao criar categoria' });
  }
}

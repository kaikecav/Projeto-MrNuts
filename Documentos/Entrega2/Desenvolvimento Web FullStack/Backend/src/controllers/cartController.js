import { pool } from '../db.js';

export async function getCarrinho(req, res) {
  const userId = req.user.id;
  try {
    const query = `
      SELECT
        c.idCarrinho,
        c.idUsuario,
        c.idProduto,
        c.quantidade,
        p.nomeProduto,
        p.preco,
        p.imagem
      FROM carrinho c
      JOIN produto p ON c.idProduto = p.idProduto
      WHERE c.idUsuario = ?
      ORDER BY c.idCarrinho DESC
    `;

    const [rows] = await pool.query(query, [userId]);

    const total = rows.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

    res.json({
      items: rows,
      total: parseFloat(total.toFixed(2)),
      itemCount: rows.reduce((sum, item) => sum + item.quantidade, 0),
    });
  } catch (err) {
    console.error('getCarrinho:', err.message);
    res.status(500).json({ error: 'Erro ao buscar carrinho' });
  }
}

export async function addCarrinho(req, res) {
  const userId = req.user.id;
  const { idProduto, quantidade } = req.body;

  if (!idProduto || !quantidade || quantidade < 1) {
    return res.status(400).json({ error: 'idProduto e quantidade sao obrigatorios' });
  }

  try {
    const [produtoRows] = await pool.query('SELECT * FROM produto WHERE idProduto = ?', [idProduto]);
    if (produtoRows.length === 0) {
      return res.status(404).json({ error: 'Produto nao encontrado' });
    }

    const [existingRows] = await pool.query(
      'SELECT * FROM carrinho WHERE idUsuario = ? AND idProduto = ?',
      [userId, idProduto]
    );

    if (existingRows.length > 0) {
      const novaQuantidade = existingRows[0].quantidade + parseInt(quantidade, 10);
      await pool.query(
        'UPDATE carrinho SET quantidade = ? WHERE idCarrinho = ?',
        [novaQuantidade, existingRows[0].idCarrinho]
      );
    } else {
      await pool.query(
        'INSERT INTO carrinho (idUsuario, idProduto, quantidade) VALUES (?, ?, ?)',
        [userId, idProduto, quantidade]
      );
    }

    const [result] = await pool.query(
      `SELECT c.*, p.nomeProduto, p.preco FROM carrinho c
       JOIN produto p ON c.idProduto = p.idProduto
       WHERE c.idUsuario = ? AND c.idProduto = ?`,
      [userId, idProduto]
    );

    res.status(201).json(result[0]);
  } catch (err) {
    console.error('addCarrinho:', err.message);
    res.status(500).json({ error: 'Erro ao adicionar ao carrinho' });
  }
}

export async function updateCarrinho(req, res) {
  const userId = req.user.id;
  const { idCarrinho } = req.params;
  const { quantidade } = req.body;

  if (!quantidade || quantidade < 1) {
    return res.status(400).json({ error: 'quantidade deve ser >= 1' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM carrinho WHERE idCarrinho = ? AND idUsuario = ?',
      [idCarrinho, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item do carrinho nao encontrado' });
    }

    await pool.query('UPDATE carrinho SET quantidade = ? WHERE idCarrinho = ?', [quantidade, idCarrinho]);

    const [updated] = await pool.query(
      `SELECT c.*, p.nomeProduto, p.preco FROM carrinho c
       JOIN produto p ON c.idProduto = p.idProduto
       WHERE c.idCarrinho = ?`,
      [idCarrinho]
    );

    res.json(updated[0]);
  } catch (err) {
    console.error('updateCarrinho:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar carrinho' });
  }
}

export async function removeCarrinho(req, res) {
  const userId = req.user.id;
  const { idCarrinho } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM carrinho WHERE idCarrinho = ? AND idUsuario = ?',
      [idCarrinho, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item do carrinho nao encontrado' });
    }

    await pool.query('DELETE FROM carrinho WHERE idCarrinho = ?', [idCarrinho]);
    res.json({ message: 'Item removido do carrinho com sucesso' });
  } catch (err) {
    console.error('removeCarrinho:', err.message);
    res.status(500).json({ error: 'Erro ao remover do carrinho' });
  }
}

export async function clearCarrinho(req, res) {
  const userId = req.user.id;

  try {
    await pool.query('DELETE FROM carrinho WHERE idUsuario = ?', [userId]);
    res.json({ message: 'Carrinho limpo com sucesso' });
  } catch (err) {
    console.error('clearCarrinho:', err.message);
    res.status(500).json({ error: 'Erro ao limpar carrinho' });
  }
}

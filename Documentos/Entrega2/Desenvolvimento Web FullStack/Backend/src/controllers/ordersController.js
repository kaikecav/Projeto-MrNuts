import { pool } from '../db.js';

const select = `
  SELECT idPedido, idUsuario, totalPedido, status, dataPedido, endereco, telefone
  FROM pedido
`;

export async function getPedidos(req, res) {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(`${select} WHERE idUsuario = ? ORDER BY dataPedido DESC`, [userId]);
    res.json(rows);
  } catch (err) {
    console.error('getPedidos:', err.message);
    res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
}

export async function getPedidoById(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [pedidoRows] = await pool.query(
      `${select} WHERE idPedido = ? AND idUsuario = ?`,
      [id, userId]
    );

    if (pedidoRows.length === 0) {
      return res.status(404).json({ error: 'Pedido nao encontrado' });
    }

    const [itensRows] = await pool.query(
      `SELECT
        pi.idPedidoItem,
        pi.idPedido,
        pi.idProduto,
        pi.quantidade,
        pi.precoUnitario,
        p.nomeProduto,
        p.imagem
      FROM pedido_item pi
      JOIN produto p ON pi.idProduto = p.idProduto
      WHERE pi.idPedido = ?`,
      [id]
    );

    res.json({
      ...pedidoRows[0],
      items: itensRows,
    });
  } catch (err) {
    console.error('getPedidoById:', err.message);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
}

export async function createPedido(req, res) {
  const userId = req.user.id;
  const { endereco, telefone } = req.body;

  if (!endereco || !telefone) {
    return res.status(400).json({ error: 'endereco e telefone sao obrigatorios' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [carrinhoRows] = await connection.query(
      `SELECT c.*, p.preco FROM carrinho c
       JOIN produto p ON c.idProduto = p.idProduto
       WHERE c.idUsuario = ?`,
      [userId]
    );

    if (carrinhoRows.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    const totalPedido = carrinhoRows.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

    const [pedidoResult] = await connection.query(
      'INSERT INTO pedido (idUsuario, totalPedido, status, endereco, telefone) VALUES (?, ?, ?, ?, ?)',
      [userId, totalPedido, 'pendente', endereco, telefone]
    );

    const idPedido = pedidoResult.insertId;

    for (const item of carrinhoRows) {
      await connection.query(
        'INSERT INTO pedido_item (idPedido, idProduto, quantidade, precoUnitario) VALUES (?, ?, ?, ?)',
        [idPedido, item.idProduto, item.quantidade, item.preco]
      );
    }

    await connection.query('DELETE FROM carrinho WHERE idUsuario = ?', [userId]);

    await connection.commit();

    const [novopedido] = await connection.query(`${select} WHERE idPedido = ?`, [idPedido]);

    res.status(201).json(novopedido[0]);
  } catch (err) {
    await connection.rollback();
    console.error('createPedido:', err.message);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  } finally {
    connection.release();
  }
}

export async function updateStatusPedido(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const statusValido = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'];
  if (!status || !statusValido.includes(status)) {
    return res.status(400).json({ error: 'Status invalido' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM pedido WHERE idPedido = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pedido nao encontrado' });
    }

    await pool.query('UPDATE pedido SET status = ? WHERE idPedido = ?', [status, id]);

    const [updated] = await pool.query(`${select} WHERE idPedido = ?`, [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('updateStatusPedido:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
}

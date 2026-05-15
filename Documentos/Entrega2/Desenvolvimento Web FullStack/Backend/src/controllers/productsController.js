import { pool } from '../db.js';

export async function getProdutos(req, res) {
  try {
    const query = `
      SELECT
        a.idAnuncio as idProduto,
        a.titulo as nomeProduto,
        c.nomeCategoria as categoria,
        a.descricao,
        a.preco,
        a.estoque,
        a.ativo,
        a.dataCriacao,
        a.imagem,
        u.nomeUsuario as fornecedor,
        c.idCategoria
      FROM anuncio a
      LEFT JOIN categoriaProduto c ON a.idCategoria = c.idCategoria
      LEFT JOIN fornecedor f ON a.idFornecedor = f.idFornecedor
      LEFT JOIN usuario u ON f.idUsuario = u.idUsuario
      WHERE a.ativo = TRUE
      ORDER BY a.dataCriacao DESC
    `;

    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('getProdutos:', err.message);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
}

export async function getProdutoById(req, res) {
  const { id } = req.params;
  try {
    const query = `
      SELECT
        a.idAnuncio as idProduto,
        a.titulo as nomeProduto,
        c.nomeCategoria as categoria,
        a.descricao,
        a.preco,
        a.estoque,
        a.ativo,
        a.dataCriacao,
        a.imagem,
        u.nomeUsuario as fornecedor
      FROM anuncio a
      LEFT JOIN categoriaProduto c ON a.idCategoria = c.idCategoria
      LEFT JOIN fornecedor f ON a.idFornecedor = f.idFornecedor
      LEFT JOIN usuario u ON f.idUsuario = u.idUsuario
      WHERE a.idAnuncio = ? AND a.ativo = TRUE
    `;

    const [rows] = await pool.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('getProdutoById:', err.message);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
}

export async function createProduto(req, res) {
  try {
    const { idCategoria, titulo, descricao, preco, estoque } = req.body;
    const idUsuario = req.user?.idUsuario;
    const imagem = req.file?.filename || null;

    if (!idCategoria || !titulo || preco === undefined) {
      return res.status(400).json({ error: 'Campos obrigatórios: idCategoria, titulo, preco' });
    }

    if (!idUsuario) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Buscar o idFornecedor do usuário
    const [fornecedorRows] = await pool.query(
      'SELECT idFornecedor FROM fornecedor WHERE idUsuario = ?',
      [idUsuario]
    );

    if (fornecedorRows.length === 0) {
      return res.status(403).json({ error: 'Você não é um fornecedor registrado' });
    }

    const idFornecedor = fornecedorRows[0].idFornecedor;

    await pool.query(
      'INSERT INTO anuncio (idFornecedor, idCategoria, titulo, descricao, preco, estoque, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [idFornecedor, idCategoria, titulo, descricao || null, preco, estoque || 0, imagem]
    );
    res.status(201).json({ mensagem: 'Produto criado com sucesso' });
  } catch (err) {
    console.error('createProduto:', err.message);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
}

export async function updateProduto(req, res) {
  const { id } = req.params;
  const { titulo, descricao, preco, estoque, ativo, idCategoria } = req.body;

  try {
    let query = 'UPDATE anuncio SET ';
    const fields = [];
    const values = [];

    if (titulo !== undefined) {
      fields.push('titulo = ?');
      values.push(titulo);
    }
    if (descricao !== undefined) {
      fields.push('descricao = ?');
      values.push(descricao);
    }
    if (preco !== undefined) {
      fields.push('preco = ?');
      values.push(preco);
    }
    if (estoque !== undefined) {
      fields.push('estoque = ?');
      values.push(estoque);
    }
    if (ativo !== undefined) {
      fields.push('ativo = ?');
      values.push(ativo);
    }
    if (idCategoria !== undefined) {
      fields.push('idCategoria = ?');
      values.push(idCategoria);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    query += fields.join(', ') + ' WHERE idAnuncio = ?';
    values.push(id);

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ mensagem: 'Produto atualizado com sucesso' });
  } catch (err) {
    console.error('updateProduto:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
}

export async function deleteProduto(req, res) {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM anuncio WHERE idAnuncio = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ mensagem: 'Produto deletado com sucesso' });
  } catch (err) {
    console.error('deleteProduto:', err.message);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
}

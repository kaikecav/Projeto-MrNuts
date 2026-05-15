import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

// Helper: remove uma imagem do disco caso exista
const removeImage = (imgPath) => {
  if (!imgPath) return;
  fs.unlink(imgPath, (err) => {
    if (err && err.code !== 'ENOENT') console.warn('removeImage:', err.message);
  });
};

// Helper: remove campo senha do retorno
const select = `
  SELECT idUsuario, tipoUsuario, nomeUsuario, email, contato, img, dataCadastro, ativo
  FROM usuario
`;

// GET /api/usuarios (publica)
export async function getUsuarios(_, res) {
  try {
    const [rows] = await pool.query(`${select} WHERE ativo = TRUE ORDER BY idUsuario DESC`);
    res.json(rows);
  } catch (err) {
    console.error('getUsuarios:', err.message);
    res.status(500).json({ error: 'Erro ao listar usuarios' });
  }
}

// GET /api/usuarios/:id (protegida)
export async function getUsuarioById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`${select} WHERE idUsuario = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('getUsuarioById:', err.message);
    res.status(500).json({ error: 'Erro ao buscar usuario' });
  }
}

// POST /api/usuarios (protegida)
export async function createUsuario(req, res) {
  const { nomeUsuario, email, senha, contato, tipoUsuario } = req.body;

  if (!nomeUsuario || !email || !senha) {
    if (req.file) removeImage(req.file.path);
    return res
      .status(400)
      .json({ error: 'nomeUsuario, email e senha sao obrigatorios' });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);
    const imgPath = req.file ? 'uploads/' + path.basename(req.file.path) : null;
    const tipo = tipoUsuario ? parseInt(tipoUsuario, 10) : 2;

    const [result] = await pool.query(
      'INSERT INTO usuario (tipoUsuario, nomeUsuario, email, senha, contato, img) VALUES (?, ?, ?, ?, ?, ?)',
      [tipo, nomeUsuario, email, hash, contato || null, imgPath]
    );

    res.status(201).json({
      id: result.insertId,
      nomeUsuario,
      email,
      contato,
      tipoUsuario: tipo,
      img: imgPath,
    });
  } catch (err) {
    if (req.file) removeImage(req.file.path);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email ja cadastrado' });
    }
    console.error('createUsuario:', err.message);
    res.status(500).json({ error: 'Erro ao criar usuario' });
  }
}

// PUT /api/usuarios/:id (protegida)
export async function updateUsuario(req, res) {
  const { id } = req.params;
  const { nomeUsuario, email, contato, tipoUsuario } = req.body;

  if (!nomeUsuario || !email) {
    if (req.file) removeImage(req.file.path);
    return res
      .status(400)
      .json({ error: 'nomeUsuario e email sao obrigatorios' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE idUsuario = ?', [
      id,
    ]);
    if (rows.length === 0) {
      if (req.file) removeImage(req.file.path);
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    const oldImg = rows[0].img;
    const newImg = req.file ? 'uploads/' + path.basename(req.file.path) : oldImg;
    const tipo = tipoUsuario ? parseInt(tipoUsuario, 10) : rows[0].tipoUsuario;

    await pool.query(
      'UPDATE usuario SET tipoUsuario = ?, nomeUsuario = ?, email = ?, contato = ?, img = ? WHERE idUsuario = ?',
      [tipo, nomeUsuario, email, contato || null, newImg, id]
    );

    // Remove imagem antiga se uma nova foi enviada
    if (req.file && oldImg) removeImage(oldImg);

    const [updated] = await pool.query(`${select} WHERE idUsuario = ?`, [id]);
    res.json(updated[0]);
  } catch (err) {
    if (req.file) removeImage(req.file.path);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email ja cadastrado' });
    }
    console.error('updateUsuario:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar usuario' });
  }
}

// DELETE /api/usuarios/:id (protegida)
export async function deleteUsuario(req, res) {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE idUsuario = ?', [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    const imgPath = rows[0].img;
    await pool.query('DELETE FROM usuario WHERE idUsuario = ?', [id]);

    if (imgPath) removeImage(imgPath);

    res.json({ message: 'Usuario excluido com sucesso' });
  } catch (err) {
    console.error('deleteUsuario:', err.message);
    res.status(500).json({ error: 'Erro ao excluir usuario' });
  }
}

// GET /api/usuarios/profile (protegida) - retorna dados do usuario logado
export async function profile(req, res) {
  try {
    const [rows] = await pool.query(`${select} WHERE idUsuario = ?`, [
      req.user.id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('profile:', err.message);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
}

// PUT /api/usuarios/me (protegida) - atualiza dados do proprio usuario
export async function updateMe(req, res) {
  const { nomeUsuario, contato, senhaAtual, novaSenha } = req.body;

  if (!nomeUsuario && !novaSenha && !contato && !req.file) {
    return res
      .status(400)
      .json({ error: 'Envie ao menos um campo para atualizar' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE idUsuario = ?', [
      req.user.id,
    ]);
    if (!rows.length) {
      if (req.file) removeImage(req.file.path);
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    const user = rows[0];
    const updates = [];
    const params = [];

    if (nomeUsuario) {
      updates.push('nomeUsuario = ?');
      params.push(nomeUsuario);
    }
    if (contato !== undefined) {
      updates.push('contato = ?');
      params.push(contato || null);
    }
    if (novaSenha) {
      if (!senhaAtual) {
        if (req.file) removeImage(req.file.path);
        return res
          .status(400)
          .json({ error: 'Envie senhaAtual para trocar a senha' });
      }
      const match = await bcrypt.compare(senhaAtual, user.senha);
      if (!match) {
        if (req.file) removeImage(req.file.path);
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }
      const hash = await bcrypt.hash(novaSenha, 10);
      updates.push('senha = ?');
      params.push(hash);
    }
    if (req.file) {
      const newImg = 'uploads/' + path.basename(req.file.path);
      updates.push('img = ?');
      params.push(newImg);
      if (user.img) removeImage(user.img);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nada para atualizar' });
    }

    params.push(req.user.id);
    await pool.query(
      `UPDATE usuario SET ${updates.join(', ')} WHERE idUsuario = ?`,
      params
    );

    const [fresh] = await pool.query(`${select} WHERE idUsuario = ?`, [
      req.user.id,
    ]);
    res.json(fresh[0]);
  } catch (err) {
    if (req.file) removeImage(req.file.path);
    console.error('updateMe:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
}

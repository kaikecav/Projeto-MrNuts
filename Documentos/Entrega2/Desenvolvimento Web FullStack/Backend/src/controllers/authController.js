import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { createToken, denyToken } from '../services/tokenService.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizeUser = (u) => ({
  id: u.idUsuario,
  tipoUsuario: u.tipoUsuario,
  nomeUsuario: u.nomeUsuario,
  email: u.email,
  contato: u.contato,
  img: u.img,
  dataCadastro: u.dataCadastro,
});

// POST /api/auth/register
export async function register(req, res) {
  const { nomeUsuario, email, senha, contato, tipoUsuario, cpf, cnpj } = req.body;

  if (!nomeUsuario || !email || !senha) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res
      .status(400)
      .json({ error: 'nomeUsuario, email e senha sao obrigatorios' });
  }
  if (!emailRegex.test(email)) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: 'Email invalido' });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);
    const imgPath = req.file ? 'uploads/' + path.basename(req.file.path) : null;
    const tipo = tipoUsuario ? parseInt(tipoUsuario, 10) : 2;

    // Iniciar transação
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Inserir na tabela usuario
      const [result] = await connection.query(
        'INSERT INTO usuario (tipoUsuario, nomeUsuario, email, senha, contato, img) VALUES (?, ?, ?, ?, ?, ?)',
        [tipo, nomeUsuario, email, hash, contato || null, imgPath]
      );

      const idUsuario = result.insertId;

      // Inserir na tabela específica baseado no tipo
      if (tipo === 1) {
        // Admin
        await connection.query(
          'INSERT INTO administrador (idUsuario, nivelAcesso) VALUES (?, ?)',
          [idUsuario, 1]
        );
      } else if (tipo === 2) {
        // Comprador - requer CPF
        if (!cpf) {
          await connection.rollback();
          return res.status(400).json({ error: 'CPF é obrigatório para compradores' });
        }
        await connection.query(
          'INSERT INTO comprador (idUsuario, cpf) VALUES (?, ?)',
          [idUsuario, cpf]
        );
      } else if (tipo === 3) {
        // Fornecedor - requer CNPJ
        if (!cnpj) {
          await connection.rollback();
          return res.status(400).json({ error: 'CNPJ é obrigatório para fornecedores' });
        }
        await connection.query(
          'INSERT INTO fornecedor (idUsuario, cnpj, nomeFantasia) VALUES (?, ?, ?)',
          [idUsuario, cnpj, nomeUsuario]
        );
      }

      await connection.commit();
      connection.release();

      res.status(201).json({
        id: idUsuario,
        nomeUsuario,
        email,
        img: imgPath,
      });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email ja cadastrado' });
    }
    console.error('register:', err.message);
    res.status(500).json({ error: 'Erro ao registrar o usuario' });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'email e senha sao obrigatorios' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuario WHERE email = ?',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'Credenciais invalidas' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(senha, user.senha);

    if (!match) {
      return res.status(401).json({ error: 'Credenciais invalidas' });
    }

    const { token } = createToken({ id: user.idUsuario });
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error('login:', err.message);
    res.status(500).json({ error: 'Erro no login' });
  }
}

// POST /api/auth/logout (protegida)
export async function logout(req, res) {
  try {
    denyToken(req.user.jti);
    res.json({ message: 'Logout realizado com sucesso' });
  } catch (err) {
    console.error('logout:', err.message);
    res.status(500).json({ error: 'Erro no logout' });
  }
}

// POST /api/auth/forgot-password
export async function forgotPassword(req, res) {
  const { email, novaSenha } = req.body;

  if (!email || !novaSenha) {
    return res
      .status(400)
      .json({ error: 'email e novaSenha sao obrigatorios' });
  }

  try {
    const hash = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE usuario SET senha = ? WHERE email = ?', [
      hash,
      email,
    ]);
    res.json({ message: 'Se o email existir, a senha foi redefinida' });
  } catch (err) {
    console.error('forgotPassword:', err.message);
    res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
}

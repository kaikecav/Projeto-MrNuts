import express from 'express';
import pool from './db.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
// CREATE - Criar usuário
app.post('/usuarios', async (req, res) => {
  try {
    const { tipoUsuario, nomeUsuario, email, senha, contato } = req.body;

    if (!tipoUsuario || !nomeUsuario || !email || !senha) {
      return res.status(400).json({ erro: 'Campos obrigatórios: tipoUsuario, nomeUsuario, email, senha' });
    }

    const [result] = await pool.execute(
      'INSERT INTO usuario (tipoUsuario, nomeUsuario, email, senha, contato) VALUES (?, ?, ?, ?, ?)',
      [tipoUsuario, nomeUsuario, email, senha, contato || null]
    );

    res.status(201).json({ id: result.insertId, mensagem: 'Usuário criado com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// READ ALL - Listar todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM usuario');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// READ ONE - Buscar usuário por ID
app.get('/usuarios/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM usuario WHERE idUsuario = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});
// UPDATE - Atualizar usuário
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { tipoUsuario, nomeUsuario, email, senha, contato } = req.body;

    if (!tipoUsuario || !nomeUsuario || !email || !senha) {
      return res.status(400).json({ erro: 'Campos obrigatórios: tipoUsuario, nomeUsuario, email, senha' });
    }

    const [result] = await pool.execute(
      'UPDATE usuario SET tipoUsuario = ?, nomeUsuario = ?, email = ?, senha = ?, contato = ? WHERE idUsuario = ?',
      [tipoUsuario, nomeUsuario, email, senha, contato || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Usuário atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// DELETE - Deletar usuário
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM usuario WHERE idUsuario = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
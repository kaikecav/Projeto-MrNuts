import { verifyToken } from '../services/tokenService.js';

export async function verifyTokenMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token nao fornecido' });
    }

    const decoded = await verifyToken(token);
    req.user = { idUsuario: decoded.id, id: decoded.id, jti: decoded.jti };
    next();
  } catch (err) {
    const status = err.message === 'Token denylisted' ? 401 : 403;
    return res.status(status).json({ error: 'Token invalido ou expirado' });
  }
}

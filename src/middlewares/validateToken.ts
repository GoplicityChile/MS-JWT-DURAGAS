import {Request, Response, NextFunction} from 'express';
import {verifyToken} from '../services/jwt.service';

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({message: 'Token no proporcionado'});
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({message: 'Token inválido o expirado'});
  }

  (req as any).project = decoded.project;
  next();
};

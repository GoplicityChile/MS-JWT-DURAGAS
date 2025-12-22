import {Request, Response} from 'express';
import {
  generateToken,
  buildTokenPayload,
  verifyToken,
} from '../services/jwt.service';
import {extractToken, isValidProject} from '../utils/projectValidator';
import {errorResponse, successResponse} from '../utils/response.helper';
import {TokenRequestBody} from '../types/auth.interface';

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Genera un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [project, idUser, roleUser]
 *             properties:
 *               project:
 *                 type: string
 *                 example: projectA
 *               idUser:
 *                 type: integer
 *                 example: 1
 *               roleUser:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Token generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 issuedAt:
 *                   type: string
 *                 expiresAt:
 *                   type: string
 */
export const getToken = (
  req: Request<{}, {}, TokenRequestBody>,
  res: Response
): void => {
  try {
    const {project, idUser, roleUser} = req.body;
    if (!project || !isValidProject(project)) {
      return errorResponse(res, 400, 'Proyecto inválido');
    }
    if (!idUser || !roleUser) {
      return errorResponse(res, 400, 'Faltan campos obligatorios');
    }
    const {payload, issuedAtLocal, expiresAtLocal} = buildTokenPayload(
      project,
      idUser,
      roleUser
    );

    const token = generateToken(payload);
    successResponse(res, {
      token: 'Bearer ' + token,
      issuedAt: issuedAtLocal,
      expiresAt: expiresAtLocal,
    });
  } catch (error: any) {
    console.error('Error en getToken:', error);
    errorResponse(res, 500, error.message || 'Error interno del servidor');
  }
};

/**
 * @swagger
 * /auth/validate-token:
 *   post:
 *     summary: Valida un token existente contra los datos enviados
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [project, idUser, roleUser, token]
 *             properties:
 *               project:
 *                 type: string
 *                 example: projectA
 *               idUser:
 *                 type: integer
 *                 example: 1
 *               roleUser:
 *                 type: string
 *                 example: admin
 *               token:
 *                 type: string
 *                 example: eyJhbGciOi...
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido o expirado
 */
export const validateTokenData = (
  req: Request<{}, {}, TokenRequestBody & {token: string}>,
  res: Response
): void => {
  try {
    const token = extractToken(req);
    const {project, idUser, roleUser} = req.body;

    if (!token) {
      return errorResponse(res, 400, 'Token no proporcionado');
    }
    if (!project || !isValidProject(project)) {
      return errorResponse(res, 400, 'Proyecto inválido');
    }

    const decoded = verifyToken(token);

    if (
      decoded.project !== project ||
      decoded.idUser !== idUser ||
      decoded.roleUser !== roleUser
    ) {
      return errorResponse(
        res,
        401,
        'El token no coincide con los datos proporcionados'
      );
    }

    return successResponse(res, {valid: true, message: 'Token válido'});
  } catch (error: any) {
    console.error('Error en validateTokenData:', error);
    return errorResponse(
      res,
      401,
      error.message || 'Token inválido o expirado'
    );
  }
};

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Renueva un token JWT válido sin haber expirado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [project, idUser, roleUser, token]
 *             properties:
 *               project:
 *                 type: string
 *                 example: projectA
 *               idUser:
 *                 type: integer
 *                 example: 1
 *               roleUser:
 *                 type: string
 *                 example: admin
 *               token:
 *                 type: string
 *                 example: eyJhbGciOi...
 *     responses:
 *       200:
 *         description: Token renovado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 issuedAt:
 *                   type: string
 *                 expiresAt:
 *                   type: string
 *       401:
 *         description: Token expirado o inválido
 */
export const refreshToken = (
  req: Request<
    {},
    {},
    {
      token: string;
      project: string;
      idUser: number;
      roleUser: string;
    }
  >,
  res: Response
): void => {
  try {
    const token = extractToken(req);
    const {project, idUser, roleUser} = req.body;
    if (!token) {
      return errorResponse(res, 400, 'Token no proporcionado');
    }

    if (!isValidProject(project)) {
      return errorResponse(res, 400, 'Proyecto inválido');
    }

    const decoded = verifyToken(token);

    if (
      decoded.project !== project ||
      decoded.idUser !== idUser ||
      decoded.roleUser !== roleUser
    ) {
      return errorResponse(
        res,
        401,
        'El token no coincide con los datos proporcionados'
      );
    }

    const {payload, issuedAtLocal, expiresAtLocal} = buildTokenPayload(
      project,
      idUser,
      roleUser
    );

    const newToken = generateToken(payload);

    return successResponse(res, {
      token: 'Bearer ' + newToken,
      issuedAt: issuedAtLocal,
      expiresAt: expiresAtLocal,
    });
  } catch (error: any) {
    console.error('Error en refreshToken:', error);
    return errorResponse(
      res,
      401,
      error.message || 'Token inválido o expirado'
    );
  }
};

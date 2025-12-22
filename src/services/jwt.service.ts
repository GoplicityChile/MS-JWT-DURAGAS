import jwt, {SignOptions} from 'jsonwebtoken';
import {JwtPayloadCustom} from '../types/auth.interface';
import {DateTime} from 'luxon';

const secret = process.env.JWT_SECRET ?? 'default_secret';
const expiresIn = (process.env.JWT_EXPIRES_IN ??
  '1h') as SignOptions['expiresIn'];

function expiresInToMs(expiresIn: string | number): number {
  if (typeof expiresIn === 'number') return expiresIn * 1000;
  const match = /^(\d+)([smhd])$/.exec(expiresIn);
  if (!match) return 60 * 60 * 1000;
  const value = parseInt(match[1], 10);
  switch (match[2]) {
  case 's':
    return value * 1000;
  case 'm':
    return value * 60 * 1000;
  case 'h':
    return value * 60 * 60 * 1000;
  case 'd':
    return value * 24 * 60 * 60 * 1000;
  default:
    return 60 * 60 * 1000;
  }
}

function toChileISOString(date: Date): string {
  return (
    DateTime.fromJSDate(date, {zone: 'utc'})
      .setZone('America/Santiago')
      .toISO() ?? ''
  );
}

export function buildTokenPayload(
  project: string,
  idUser: number,
  roleUser: string
) {
  const issuedAt = new Date();
  const msToExpire = expiresInToMs(expiresIn ?? '1h');
  const expiresAt = new Date(issuedAt.getTime() + msToExpire);
  const payload: JwtPayloadCustom = {
    project,
    idUser,
    roleUser,
  };
  return {
    payload,
    issuedAt,
    expiresAt,
    issuedAtLocal: toChileISOString(issuedAt),
    expiresAtLocal: toChileISOString(expiresAt),
  };
}

export const generateToken = (payload: JwtPayloadCustom): string => {
  try {
    const options: SignOptions = {
      expiresIn,
      algorithm: 'HS256',
    };
    return jwt.sign(payload, secret, options);
  } catch (error) {
    console.error('Error real al generar el token:', error);
    throw new Error('Error al generar el token');
  }
};

export const verifyToken = (token: string): JwtPayloadCustom => {
  try {
    return jwt.verify(token, secret) as JwtPayloadCustom;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw new Error('Error al verificar el token');
  }
};

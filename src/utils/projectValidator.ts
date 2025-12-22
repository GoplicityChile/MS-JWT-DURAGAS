import { Request } from 'express';
const getValidProjects = (): string[] => {
  const raw = process.env.VALID_PROJECTS ?? '';
  return raw
    .split(',')
    .map((proj) => proj.trim())
    .filter((proj) => proj.length > 0);
};
export const isValidProject = (project: string): boolean => {
  return getValidProjects().includes(project);
};

export function extractToken(req: Request): string | undefined {
  let authHeader = req.headers['authorization'] ?? req.headers['Authorization'];
  if (Array.isArray(authHeader)) {
    authHeader = authHeader[0];
  }
  if (
    authHeader &&
    typeof authHeader === 'string' &&
    authHeader.startsWith('Bearer ')
  ) {
    return authHeader.slice(7).trim();
  }
  if (req.body && typeof req.body === 'object' && 'token' in req.body) {
    const token = (req.body as any).token;
    if (typeof token === 'string' && token.startsWith('Bearer ')) {
      return token.slice(7).trim();
    }
    return token;
  }
  return undefined;
}

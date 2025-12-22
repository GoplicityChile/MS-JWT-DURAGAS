import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateRequest(DTOClass: any) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dtoObject = plainToInstance(DTOClass, req.body);
    const errors = await validate(dtoObject);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }
    next();
  };
}
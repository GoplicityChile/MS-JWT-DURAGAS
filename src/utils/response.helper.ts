import { Response } from 'express';

export const successResponse = (
  res: Response,
  data: any,
  statusCode: number = 200
): void => {
  res.status(statusCode).json(data);
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string
): void => {
  res.status(statusCode).json({
    error: true,
    message
  });
};

import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './config/swagger.config';
import { successResponse, errorResponse } from './utils/response.helper';
import authRoutes from './routes/auth.routes';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.disable('x-powered-by');
app.use(helmet());

const whitelist = (process.env.CORS_WHITELIST ?? '')
  .split(',')
  .map(u => u.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) return callback(null, true);
    return callback(new Error(`Origen ${origin} no autorizado por CORS`));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', authRoutes);

app.get('/health', (_req: Request, res: Response) => {
  return successResponse(res, { message: 'Microservicio de correo activo', success: true }, 200);
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error no controlado:', err);
  return errorResponse(res, 500, err.message || 'Error interno del servidor');
});

app.listen(PORT, () => {
  console.log(`Microservicio de correo escuchando en puerto ${PORT}`);
  console.log(`Documentación Swagger: http://localhost:${PORT}/api/docs`);
});

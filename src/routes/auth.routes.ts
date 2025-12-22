import {Router} from 'express';
import {
  getToken,
  refreshToken,
  validateTokenData,
} from '../controllers/auth.controller';
import {validateRequest} from '../middlewares/validateRequest';
import {TokenRequestDTO} from '../dto/token-request.dto';
import {ValidateRequestDTO} from '../dto/validate-request.dto';
import {validateToken} from '../middlewares/validateToken';
import {ValidateTokenRequestDTO} from '../dto/validate-token-request.dto';
import {RefreshTokenRequestDTO} from '../dto/refresh-token-request.dto';

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/token', validateRequest(TokenRequestDTO), getToken);
router.post(
  '/validate',
  validateRequest(ValidateRequestDTO),
  asyncHandler(validateToken)
);
router.post(
  '/validate-token',
  validateRequest(ValidateTokenRequestDTO),
  validateTokenData
);
router.post(
  '/refresh-token',
  validateRequest(RefreshTokenRequestDTO),
  refreshToken
);
export default router;

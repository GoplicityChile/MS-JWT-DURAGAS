export interface TokenRequestBody {
  project: string;
  idUser: number;
  roleUser: string;
}

export interface ValidateRequestBody {
  token: string;
}

export interface JwtPayloadCustom {
  project: string;
  idUser: number;
  roleUser: string;
  iat?: number;
  exp?: number;
}

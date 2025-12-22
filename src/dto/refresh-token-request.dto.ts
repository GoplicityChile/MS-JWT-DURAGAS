import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class RefreshTokenRequestDTO {
  @IsString()
  @IsNotEmpty()
    token!: string;

  @IsString()
  @IsNotEmpty()
    project!: string;

  @IsNumber()
    idUser!: number;

  @IsString()
  @IsNotEmpty()
    roleUser!: string;
}

import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class TokenRequestDTO {
  @IsString()
  @IsNotEmpty()
    project!: string;

  @IsNumber()
    idUser!: number;

  @IsString()
  @IsNotEmpty()
    roleUser!: string;
}

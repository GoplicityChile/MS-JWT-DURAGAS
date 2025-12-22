import {IsNotEmpty, IsString} from 'class-validator';

export class ValidateRequestDTO {
  @IsString()
  @IsNotEmpty()
    token!: string;
}

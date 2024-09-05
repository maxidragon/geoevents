import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ExternalRegistrationDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  comment: string;

  @IsString()
  @IsOptional()
  fullName: string;
}

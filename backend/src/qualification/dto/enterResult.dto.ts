import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class EnterResultDto {
  @IsString()
  @IsNotEmpty()
  registrationId: string;

  @IsNumber()
  @Min(0)
  score: number;

  @IsNumber()
  @Min(0)
  maxScore: number;

  @IsNumber()
  @Min(0)
  totalTime: number;
}

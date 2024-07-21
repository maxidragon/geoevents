import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsBoolean()
  isPublic: boolean;

  @IsBoolean()
  useExternalRegistration: boolean;

  @IsBoolean()
  autoAcceptRegistrations: boolean;

  @IsBoolean()
  enableQualifications: boolean;

  @IsBoolean()
  enableGroups: boolean;

  @IsBoolean()
  enableKnockoutStage: boolean;

  @IsArray()
  organizers: User[];
}

export class User {
  @IsString()
  @IsNotEmpty()
  id: string;
}

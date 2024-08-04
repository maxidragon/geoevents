import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class EventDto {
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

  @IsDate()
  registrationOpen: Date;

  @IsDate()
  registrationClose: Date;

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

  @IsNumber()
  @Min(0)
  proceedFromQualifications: number;

  @IsArray()
  organizers: User[];
}

export class User {
  @IsString()
  @IsNotEmpty()
  id: string;
}

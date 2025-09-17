import { IsString, IsNotEmpty, IsEmail, IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({ description: 'Patient first name', example: 'Иван' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Patient last name', example: 'Иванов' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Date of birth', example: '1990-01-15' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ description: 'Phone number', example: '+7 900 123 45 67' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.replace(/\s/g, ''))
  phoneNumber: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'ivan@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;
}

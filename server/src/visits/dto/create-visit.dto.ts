import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum VisitStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateVisitDto {
  @ApiProperty({ description: 'Patient ID', example: 'uuid-string-here' })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ description: 'Visit date and time', example: '2024-01-15T10:00:00.000Z' })
  @IsDateString()
  visitDate: string;

  @ApiProperty({ description: 'Medical diagnosis', example: 'Грипп' })
  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @ApiProperty({ description: 'Treatment prescribed', example: 'Постельный режим, парацетамол' })
  @IsString()
  @IsNotEmpty()
  treatment: string;

  @ApiPropertyOptional({
    description: 'Visit status',
    enum: VisitStatus,
    example: VisitStatus.SCHEDULED
  })
  @IsEnum(VisitStatus)
  @IsOptional()
  status?: VisitStatus = VisitStatus.SCHEDULED;

  @ApiPropertyOptional({ description: 'Additional notes', example: 'Пациент жалуется на головную боль' })
  @IsString()
  @IsOptional()
  notes?: string;
}

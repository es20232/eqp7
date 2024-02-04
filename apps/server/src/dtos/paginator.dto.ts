import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

enum orderDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationParamsDto {
  @ApiPropertyOptional({
    description: 'O número de registros exibidos por página',
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  take?: number;

  @ApiPropertyOptional({
    description: 'A partir de qual registro a busca deve continuar',
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  cursor?: number;

  @ApiPropertyOptional({
    description: 'Uma string para ser usada na pesquisa',
    format: 'exemplo+de+pesquisa',
  })
  @IsOptional()
  @Transform(({ value }): string => {
    return value
      .replace(/\+/g, ' ')
      .replace(/[()|&:*!]/g, ' ')
      .trim()
      .split(/\s+/)
      .join(' & ');
  })
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Campo pelo qual os registros devem ser ordenados',
  })
  @IsOptional()
  orderParameter?: string;

  @ApiPropertyOptional({
    description: 'Direção da ordenação (ascendente ou descendente)',
    enum: orderDirection,
    default: 'asc',
  })
  @IsOptional()
  @IsString()
  @IsEnum(orderDirection)
  orderDirection?: orderDirection;
}

export class PaginationMeta {
  @ApiProperty()
  cursor: number | null;

  @ApiProperty()
  hasMore: boolean;
}

export class PaginationResponseDto<T> {
  @ApiProperty({ type: [Object] })
  data: T[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;

  constructor(partial: Partial<PaginationResponseDto<T>>) {
    Object.assign(this, partial);
  }
}

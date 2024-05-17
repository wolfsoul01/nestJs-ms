import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional, IsArray, IsNumber, IsString } from 'class-validator';
import { ObjectValueDto } from './object-values.dto';

export class FindObjectValueDto extends PartialType(OmitType(ObjectValueDto, ['createdAt', 'updatedAt'])) {
  @ApiProperty({ type: Number, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  belongsToObjectIds?: number[];

  @ApiProperty({ type: Number, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  objectPropertyIds?: number[];

  @ApiProperty({ type: String, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  values?: string[];

  @ApiProperty({ type: Number, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  objectValueIds?: number[];

  @ApiProperty({ type: String, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { DynamicObjectDto } from './dynamic-objects.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDynamicObjectDto extends PartialType(
  OmitType(DynamicObjectDto, ['createdAt', 'updatedAt', 'createdById']),
) {
  @ApiProperty({ description: 'The unique identifier of the dynamic object', example: 1 })
  @IsNumber({}, { message: 'The ID must be a number' })
  @IsNotEmpty({ message: 'The ID is required' })
  id: number;

  @ApiProperty({ description: 'The ID of the user who last updated the dynamic object', example: 3, type: Number })
  @IsNumber({}, { message: 'The updatedById must be a number' })
  @IsNotEmpty({ message: 'The updatedById is required' })
  updatedById: number;
}

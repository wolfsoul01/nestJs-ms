import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ObjectValueDto } from './object-values.dto';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class UpdateObjectValueDto extends PartialType(
  OmitType(ObjectValueDto, ['createdAt', 'updatedAt', 'tag', 'objectValueId', 'listsValueIds']),
) {
  @ApiProperty({ description: 'The ID of the object this value belongs to', example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  belongsToObjectId: number;

  @ApiProperty({ description: 'The ID of the property this value is associated with', example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  objectPropertyId: number;

  @ApiProperty({ description: 'The value', example: 'Example Value', required: true })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  value: string;
}

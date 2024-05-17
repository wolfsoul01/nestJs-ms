import { ObjectProperty } from '@avantodev/avanto-db';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length, IsNumber, IsString, IsArray, IsDate } from 'class-validator';

export class ObjectValueDto {
  @ApiProperty({ description: 'The ID of the object this value belongs to', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  belongsToObjectId: number;

  @ApiProperty({ description: 'The ID of the property this value is associated with', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  objectPropertyId: number;

  @ApiProperty({ description: 'The value', example: 'Example Value' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  value: string;

  @ApiProperty({ description: 'List of IDs for the values', example: [1, 2], required: false })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  listsValueIds?: number[];

  @ApiProperty({ description: 'The ID of the object value', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  objectValueId?: number;

  @ApiProperty({ description: 'Tag associated with the value', example: 'Example Tag' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  tag: string;

  @ApiProperty({ description: 'The date and time when the value was last updated', example: '2021-07-21T17:32:28Z' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ description: 'The date and time when the value was created', example: '2021-07-21T17:32:28Z' })
  @IsDate()
  createdAt: Date;
}

export class MapObjectValueDto {
  //belongsToObject: DynamicObject;

  objectProperty: ObjectProperty;

  value: string;
}

// export class CheckObjectPropertyBelongsToObjectDto {
//   objectProperty: ObjectProperty;
//   objectDefinition: ObjectDefinition;
// }

export class BulkObjectValuesDto {
  objectValues: [
    {
      objectPropertyId: number;
      value: string;
    },
  ];
  belongsToObjectId: number;
}

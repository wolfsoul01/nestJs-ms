import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length, IsBoolean, IsNumber, IsString } from 'class-validator';

export class ObjectPropertyDto {
  @ApiProperty({ description: 'The unique identifier of the object property', example: 1, type: Number })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'The data type of the object property', example: 'string', type: String })
  @IsString()
  @IsNotEmpty()
  dataType: string;

  @ApiProperty({
    description: 'The name of the object property',
    example: 'Property Name',
    type: String,
    maxLength: 255,
    minLength: 1,
  })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    description: 'The description of the object property',
    example: 'This is a property description',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Indicates if the object property is displayable', example: true, type: Boolean })
  @IsBoolean()
  isDisplayable: boolean;

  @ApiProperty({ description: 'Indicates if the object property is required', example: false, type: Boolean })
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty({ description: 'The order of the object property', example: 1, type: Number })
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiProperty({
    description: 'The unique identifier of the object definition this property belongs to',
    example: 1,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  objectDefinitionId: number;

  @ApiProperty({ description: 'The ID of the user who created the object property', example: 100, type: Number })
  @IsNumber()
  createdById: number;

  @ApiProperty({ description: 'The ID of the user who last updated the object property', example: 101, type: Number })
  @IsNumber()
  updatedById: number;

  @ApiProperty({ description: 'Indicates if the object property is enabled', example: true, type: Boolean })
  @IsBoolean()
  enabled: boolean;

  listTypeId?: number;

  objectTypeId?: number;

  @ApiProperty({
    description: 'The date and time when the object definition was created',
    example: '2021-07-21T17:32:28Z',
    type: Date,
    default: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the object definition was last updated',
    example: '2021-07-22T17:32:28Z',
    type: Date,
    default: new Date(),
  })
  updatedAt: Date;
}

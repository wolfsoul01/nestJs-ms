import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class ObjectDefintionDto {
  @ApiProperty({ description: 'The unique identifier of the object definition', example: 1 })
  id: number;

  @IsNotEmpty()
  @Length(2, 200)
  @ApiProperty({
    description: 'The name of the object definition',
    example: 'Example Name',
    minLength: 2,
    maxLength: 200,
  })
  name: string;

  @IsOptional()
  @Length(2, 500)
  @ApiProperty({
    description: 'The description of the object definition',
    example: 'Example Description',
    nullable: true,
    minLength: 2,
    maxLength: 500,
  })
  description?: string;

  @ApiProperty({
    description: 'Indicates whether the object definition is enabled (deleted) or not',
    example: true,
    default: true,
  })
  enabled: boolean;

  @ApiProperty({
    description: 'An array of IDs representing the properties of the object definition',
    example: [1, 2, 3],
    type: [Number],
    required: false,
  })
  objectProperties?: number[];

  @ApiProperty({ description: 'The ID of the user who created the object definition', example: 2, type: Number })
  createdById: number;

  @ApiProperty({ description: 'The ID of the user who last updated the object definition', example: 3, type: Number })
  updatedById: number;

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

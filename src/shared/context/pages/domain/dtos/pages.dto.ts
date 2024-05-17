import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';

export class PageDto {
  @ApiProperty({ description: 'The unique identifier of the page', example: 1 })
  id: number;

  @IsNotEmpty()
  @Length(2, 200)
  @ApiProperty({
    description: 'The name of the page',
    example: 'Example Name',
    minLength: 2,
    maxLength: 200,
  })
  name: string;

  @IsOptional()
  @Length(2, 500)
  @ApiProperty({
    description: 'The description of the page',
    example: 'Example Description',
    nullable: true,
    minLength: 2,
    maxLength: 500,
  })
  description?: string;

  @ApiProperty({
    description: 'The unique identifier of the object definition this property belongs to',
    example: 1,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  objectDefinitionId: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsNumber, IsArray, IsDate } from 'class-validator';

export class DynamicObjectDto {
  @ApiProperty({ description: 'The unique identifier of the dynamic object', example: 1 })
  @IsNumber({}, { message: 'ID must be a number' })
  @IsNotEmpty({ message: 'ID is required' })
  id: number;

  @ApiProperty({ description: 'Indicates whether the dynamic object is enabled or not', example: true })
  @IsBoolean({ message: 'Enabled must be a boolean value' })
  enabled: boolean;

  @ApiProperty({
    description: 'An array of IDs representing the values of the dynamic object',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray({ message: 'ObjectValueIds must be an array' })
  @IsNumber({}, { each: true, message: 'Each value in ObjectValueIds must be a number' })
  objectValueIds: number[];

  @ApiProperty({ description: 'The ID of the object definition associated with the dynamic object', example: 1 })
  @IsNumber({}, { message: 'ObjectDefinitionId must be a number' })
  objectDefinitionId: number;

  @ApiProperty({ description: 'The ID of the tenant associated with the dynamic object', example: 1 })
  @IsNumber({}, { message: 'TenantId must be a number' })
  tenantId: number;

  @ApiProperty({ description: 'The ID of the user who created the dynamic object', example: 2, type: Number })
  @IsNumber({}, { message: 'CreatedById must be a number' })
  createdById: number;

  @ApiProperty({ description: 'The ID of the user who last updated the dynamic object', example: 3, type: Number })
  @IsNumber({}, { message: 'UpdatedById must be a number' })
  updatedById: number;

  @ApiProperty({
    description: 'The date and time when the dynamic object was created',
    example: '2021-07-21T17:32:28Z',
    type: Date,
  })
  @IsDate({ message: 'CreatedAt must be a valid date' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the dynamic object was last updated',
    example: '2021-07-22T17:32:28Z',
    type: Date,
  })
  @IsDate({ message: 'UpdatedAt must be a valid date' })
  updatedAt: Date;
}

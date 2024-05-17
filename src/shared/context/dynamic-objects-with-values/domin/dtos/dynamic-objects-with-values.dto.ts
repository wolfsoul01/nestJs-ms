import { OmitType, ApiProperty } from '@nestjs/swagger';

export class ObjectValuesDto {
  @ApiProperty({
    example: 1,
    description: 'Property id that belongs to the object definition, that you are going to assign a value',
  })
  propertyId: number;

  @ApiProperty({
    example: 'Value that corresponds',
    description: `Value that you are goint to assign to the property, a string that will represent either a number, date or text.
      Make shure that the value you put matches the property datatype`,
  })
  value: string;
}

export class DynamicObjectsWithValuesDto {
  @ApiProperty({ example: 1, description: 'Id of the object type' })
  objectDefinitionId: number;

  @ApiProperty({ example: 1, description: 'Id of the user who creates de object' })
  userId: number;

  @ApiProperty({ example: 1, description: 'Id of the tenant where the object belongs' })
  tenantId: number;

  @ApiProperty({
    example: 1,
    description: 'Id of the object if the object exists. If is empty, then a new object will be created',
    nullable: true,
  })
  id?: number;

  @ApiProperty({ type: [ObjectValuesDto], description: 'Values of the object properties' })
  values: ObjectValuesDto[];
}

export class CreateDynamicObjectsDto extends OmitType(DynamicObjectsWithValuesDto, ['objectDefinitionId']) {}

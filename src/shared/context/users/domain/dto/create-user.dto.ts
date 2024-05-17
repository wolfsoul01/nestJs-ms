import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateUserDto implements Omit<UserDto, 'id' | 'createdAt' | 'updatedAt'> {
  @IsNotEmpty()
  @Length(2, 200)
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @Length(2, 200)
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @Length(2, 200)
  @ApiProperty()
  fireBaseId?: string;

  @ApiProperty()
  validated: boolean;

  @ApiProperty()
  BackOfficeAccess?: boolean;

  @ApiProperty()
  SaasAccess?: boolean;

  @IsNotEmpty()
  @IsEmail()
  @Length(2, 200)
  @ApiProperty()
  email: string;

  @IsOptional()
  @ApiProperty()
  phone?: string;

  @ApiProperty()
  enabled?: boolean;

  @ApiProperty({ nullable: true, type: [Number] })
  tenantsIds?: number[];

  @ApiProperty({ nullable: true, type: [Number] })
  userRoleByTenantsIds?: number[];
}

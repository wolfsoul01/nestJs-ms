import { Injectable, Logger } from '@nestjs/common';
import { Options } from '../../../dataTypes/Options';
import { getResponse, getValidEndpointUrl } from '../../../utils';
import { User } from '@avantodev/avanto-db';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private usersUrl = getValidEndpointUrl(process.env.USERS_MS_URL, 'USERS_MS_URL');

  async findAll(): Promise<[User] | null> {
    try {
      const options = new Options('GET', { 'Content-Type': 'application/json' });
      return getResponse(`${this.usersUrl}users`, options, this.logger);
    } catch (e) {
      this.logger.error(`${this.findAll.name}:: error :: ${e}`);
      throw e;
    }
  }

  async findMany(findPayload: FindUserDto): Promise<[User] | null> {
    try {
      const options = new Options('POST', { 'Content-Type': 'application/json' }, JSON.stringify(findPayload));
      return getResponse(`${this.usersUrl}users/many/`, options, this.logger);
    } catch (e) {
      this.logger.error(`${this.findMany.name}:: error :: ${e}`);
      throw e;
    }
  }

  async findOne(userId: number): Promise<User | null> {
    try {
      const options = new Options('GET', { 'Content-Type': 'application/json' });
      return getResponse(`${this.usersUrl}users/${userId}`, options, this.logger);
    } catch (e) {
      this.logger.error(`${this.findOne.name}:: error :: ${e}`);
      throw e;
    }
  }
}

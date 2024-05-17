import { Injectable, Logger } from '@nestjs/common';
import { Options } from '../../../../shared/dataTypes/Options';
import { getResponse, recordsMsUrl } from '../../../../shared/utils';
import { FindListsDto } from './dto/lists.dto';
import { Lists } from '@avantodev/avanto-db';

@Injectable()
export class ListsService {
  private readonly logger = new Logger(ListsService.name);
  private listsUrl = `${recordsMsUrl()}lists`;

  async findMany(findManyPayload: FindListsDto) {
    try {
      const options = new Options('POST', { 'Content-Type': 'application/json' }, JSON.stringify(findManyPayload));
      return getResponse(`${this.listsUrl}/many/`, options, this.logger);
    } catch (e) {
      this.logger.error(`${this.findMany.name}:: error :: ${e}`);
      throw e;
    }
  }

  async findAll() {
    try {
      const options = new Options('GET', { 'Content-Type': 'application/json' });
      return getResponse(`${this.listsUrl}`, options, this.logger);
    } catch (e) {
      this.logger.error(`${this.findAll.name}:: error :: ${e}`);
      throw e;
    }
  }

  async findOne(id: number) {
    try {
      // const options = new Options('GET', { 'Content-Type': 'application/json' });
      // return getResponse(`${this.listsUrl}/${id}`, options, this.logger);
      const options = new Options(
        'POST',
        { 'Content-Type': 'application/json' },
        JSON.stringify({
          id,
        }),
      );
      const founded: Lists[] = (await getResponse(`${this.listsUrl}/many/`, options, this.logger)) as Lists[];
      return founded[0];
    } catch (e) {
      this.logger.error(`${this.findOne.name}:: error :: ${e}`);
      throw e;
    }
  }
}

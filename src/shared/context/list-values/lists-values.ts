import { Injectable, Logger } from '@nestjs/common';
import { Options } from '../../../shared/dataTypes/Options';
import { recordsMsUrl, getResponse } from '../../../shared/utils';
import { FindListsValuesDto } from './domain/dtos/list-values.dto';
import { ListsValues } from '@avantodev/avanto-db';

@Injectable()
export class ListsValuesService {
  private readonly logger = new Logger(ListsValuesService.name);
  private listValuesUrl = `${recordsMsUrl()}lists-values`;

  async findMany(findManyPayload: FindListsValuesDto): Promise<ListsValues[]> {
    try {
      const options = new Options('POST', { 'Content-Type': 'application/json' }, JSON.stringify(findManyPayload));
      return getResponse(`${this.listValuesUrl}/many/`, options, this.logger);
    } catch (e) {
      this.logger.error(`${this.findMany.name}:: error :: ${e}`);
      throw e;
    }
  }

  async findAll(): Promise<ListsValues[]> {
    try {
      const options = new Options('GET', { 'Content-Type': 'application/json' });
      return getResponse(`${this.listValuesUrl}`, options, this.logger);
    } catch (e) {
      this.logger.error(`${this.findAll.name}:: error :: ${e}`);
      throw e;
    }
  }

  async getById(id: number): Promise<ListsValues> {
    try {
      const options = new Options('GET', { 'Content-Type': 'application/json' });
      return getResponse(`${this.listValuesUrl}/${id}`, options, this.logger);
    } catch (e) {
      this.logger.error(`${this.findAll.name}:: error :: ${e}`);
      throw e;
    }
  }
}

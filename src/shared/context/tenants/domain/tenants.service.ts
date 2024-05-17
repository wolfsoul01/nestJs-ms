import { Tenant } from '@avantodev/avanto-db';
import { Injectable, Logger } from '@nestjs/common';
import { Options } from '../../../../shared/dataTypes/Options';
import { getResponse, tenantsMsUrl } from '../../../../shared/utils';
import { FindTenantDto } from './dto/find-tenant.dto';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);
  private tenantsUrl = `${tenantsMsUrl()}tenants`;

  async findAll(): Promise<Tenant[]> {
    const operation = 'findAll';
    this.logger.log(`${operation}:: starting to get all tenants`);
    try {
      const options = new Options('GET', { 'Content-Type': 'application/json' });
      this.logger.debug(`${operation}:: using URL ${this.tenantsUrl} with options ${JSON.stringify(options)}`);
      const response = await getResponse(this.tenantsUrl, options, this.logger);
      this.logger.log(`${operation}:: successfully retrieved all tenants`);
      return response;
    } catch (e) {
      this.logger.error(`${operation}:: error :: ${e.message}`, e.stack);
      throw e;
    }
  }

  async findMany(findManyPayload: FindTenantDto): Promise<Tenant[]> {
    const operation = 'findMany';
    this.logger.log(`${operation}:: starting to find many tenants with payload ${JSON.stringify(findManyPayload)}`);
    try {
      const options = new Options('POST', { 'Content-Type': 'application/json' }, JSON.stringify(findManyPayload));
      this.logger.debug(`${operation}:: using URL ${this.tenantsUrl}/many with options ${JSON.stringify(options)}`);
      const response = await getResponse(`${this.tenantsUrl}/many`, options, this.logger);
      this.logger.log(`${operation}:: successfully found many tenants`);
      return response;
    } catch (e) {
      this.logger.error(`${operation}:: error :: ${e.message}`, e.stack);
      throw e;
    }
  }

  async findOne(id: number): Promise<Tenant> {
    const operation = 'findOne';
    this.logger.log(`${operation}:: starting to find one tenant with ID ${id}`);
    try {
      const options = new Options('GET', { 'Content-Type': 'application/json' });
      this.logger.debug(`${operation}:: using URL ${this.tenantsUrl}/${id} with options ${JSON.stringify(options)}`);
      const response = await getResponse(`${this.tenantsUrl}/${id}`, options, this.logger);
      this.logger.log(`${operation}:: successfully found tenant with ID ${id}`);
      return response;
    } catch (e) {
      this.logger.error(`${operation}:: error :: ${e.message}`, e.stack);
      throw e;
    }
  }
}

import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DynamicObjectsWithValuesService } from '../../shared/context/dynamic-objects-with-values/dynamic-objects-with-values.service';
import { DynamicObjectsWithValuesDto } from '../../shared/context/dynamic-objects-with-values/domin/dtos/dynamic-objects-with-values.dto';

@Controller('dynamic-objects-with-values')
export class DynamicObjectsWithValuesController {
  private readonly logger = new Logger(DynamicObjectsWithValuesController.name);

  constructor(private readonly dynamicObjectsWithValuesService: DynamicObjectsWithValuesService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update a dynamic object with values' })
  @ApiResponse({ status: 201, description: 'The dynamic object with values has been successfully created or updated.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createOrUpdate(
    @Body()
    dynamicObjectData: DynamicObjectsWithValuesDto,
  ): Promise<any> {
    try {
      this.logger.log(`Creating or updating dynamic object with values...`);
      const result = await this.dynamicObjectsWithValuesService.createOrUpdateDynamicObject(dynamicObjectData);
      this.logger.log(`Dynamic object with values created or updated with id: ${result.id}.`);
      return result;
    } catch (e) {
      this.logger.error(`Failed to create or update dynamic object with values: ${e.message}`, e.stack);
      throw e;
    }
  }
}

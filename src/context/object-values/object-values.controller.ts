import { Body, Controller, Get, Post, Patch, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ObjectValuesService } from '../../shared/context/object-values/object-values.service';
import { CreateObjectValueDto } from '../../shared/context/object-values/domain/dtos/create-object-values.dto';
import { UpdateObjectValueDto } from '../../shared/context/object-values/domain/dtos/update-object-values.dto';
import { FindObjectValueDto } from '../../shared/context/object-values/domain/dtos/find-object-values.dto';
import { ObjectValue } from '@avantodev/avanto-db';

@ApiTags('Object Values')
@Controller('object-values')
export class ObjectValuesController {
  private readonly logger = new Logger(ObjectValuesController.name);

  constructor(private readonly objectValuesService: ObjectValuesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new object value' })
  @ApiResponse({ status: 201, description: 'The object value has been successfully created.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() createObjectValueDto: CreateObjectValueDto): Promise<ObjectValue> {
    try {
      this.logger.log(`Creating new object value...`);
      const result = await this.objectValuesService.create(createObjectValueDto);
      this.logger.log(`Created object value with tag: ${result.tag}.`);
      return result;
    } catch (e) {
      throw e;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all object values' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all object values.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(@Body() findObjectValueDto: FindObjectValueDto): Promise<ObjectValue[]> {
    this.logger.log('Starting to fetch all object values...');
    try {
      const objectValues = await this.objectValuesService.findMany(findObjectValueDto);
      this.logger.log(`Successfully fetched ${objectValues.length} object values.`);
      return objectValues;
    } catch (error) {
      this.logger.error(`Failed to fetch object values: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':tag')
  @ApiOperation({ summary: 'Get an object value by tag' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved object value.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findOne(@Param('tag') tag: string): Promise<ObjectValue | undefined> {
    this.logger.log(`Starting to fetch object value with tag: ${tag}...`);
    try {
      const objectValue = await this.objectValuesService.findOne(tag);
      this.logger.log(`Successfully fetched object value with tag: ${tag}.`);
      return objectValue;
    } catch (error) {
      this.logger.error(`Failed to fetch object value: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch()
  @ApiOperation({ summary: 'Update an object value' })
  @ApiResponse({ status: 200, description: 'The object value has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(@Body() updateObjectValueDto: UpdateObjectValueDto): Promise<ObjectValue> {
    this.logger.log(`Updating object value...`);
    try {
      const result = await this.objectValuesService.update(updateObjectValueDto);
      this.logger.log(`Updated object value with tag: ${result.tag}.`);
      return result;
    } catch (e) {
      this.logger.error(`Failed to update object value: ${e.message}`, e.stack);
      throw e;
    }
  }
}

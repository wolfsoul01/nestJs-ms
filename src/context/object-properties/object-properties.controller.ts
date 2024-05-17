import { Body, Controller, Get, Post, Patch, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ObjectPropertiesService } from '../../shared/context/object-properties/object-properties.service';
import { CreateObjectPropertyDto } from '../../shared/context/object-properties/domain/dtos/create-object-properties.dto';
import { FindObjectPropertiesDto } from '../../shared/context/object-properties/domain/dtos/find-object-properties.dto';
import { UpdateObjectPropertyDto } from '../../shared/context/object-properties/domain/dtos/update-object-properties.dto';

@ApiTags('Object Properties')
@Controller('object-properties')
export class ObjectPropertiesController {
  private readonly logger = new Logger(ObjectPropertiesController.name);

  constructor(private readonly objectPropertiesService: ObjectPropertiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new object property' })
  @ApiResponse({ status: 201, description: 'The object property has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() createObjectPropertyDto: CreateObjectPropertyDto) {
    try {
      this.logger.log(`Creating new object property...`);
      const result = await this.objectPropertiesService.create(createObjectPropertyDto);
      this.logger.log(`Created object property with id: ${result.id}.`);
      return result;
    } catch (e) {
      this.logger.error(`Failed to create object property: ${e.message}`, e.stack);
      throw e;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all object properties' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all object properties.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll() {
    try {
      this.logger.log('Starting to fetch all object properties...');
      const objectProperties = await this.objectPropertiesService.findMany(new FindObjectPropertiesDto());
      this.logger.log(`Successfully fetched ${objectProperties.length} object properties.`);
      return objectProperties;
    } catch (error) {
      this.logger.error(`Failed to fetch object properties: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('/many')
  @ApiOperation({ summary: 'Find many object properties based on criteria' })
  @ApiResponse({ status: 200, description: 'Successfully found object properties.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findMany(@Body() findObjectPropertiesDto: FindObjectPropertiesDto) {
    try {
      this.logger.log(
        `Starting to find many object properties with criteria: ${JSON.stringify(findObjectPropertiesDto)}`,
      );
      const foundObjectProperties = await this.objectPropertiesService.findMany(findObjectPropertiesDto);
      this.logger.log(`Successfully found ${foundObjectProperties.length} object properties matching criteria.`);
      return foundObjectProperties;
    } catch (error) {
      this.logger.error(
        `Failed to find object properties with criteria: ${JSON.stringify(findObjectPropertiesDto)}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Patch()
  @ApiOperation({ summary: 'Update an object property' })
  @ApiResponse({ status: 200, description: 'The object property has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(@Body() updateObjectPropertyDto: UpdateObjectPropertyDto) {
    try {
      this.logger.log(`Updating object property with id: ${updateObjectPropertyDto.id}...`);
      const result = await this.objectPropertiesService.update(updateObjectPropertyDto);
      this.logger.log(`Updated object property with id: ${result.id}.`);
      return result;
    } catch (e) {
      this.logger.error(`Failed to update object property: ${e.message}`, e.stack);
      throw e;
    }
  }
}

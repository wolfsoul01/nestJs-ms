import { Body, Controller, Get, Post, Patch, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DynamicObjectsService } from '../../shared/context/dynamic-objects/dynamic-objects.service';
import { CreateDynamicObjectDto } from '../../shared/context/dynamic-objects/domain/dtos/create-dynamic-objects.dto';
import { FindDynamicObjectsDto } from '../../shared/context/dynamic-objects/domain/dtos/find-dynamic-objects.dto';
import { UpdateDynamicObjectDto } from '../../shared/context/dynamic-objects/domain/dtos/update-dynamic-objects.dto';

@ApiTags('Dynamic Objects')
@Controller('dynamic-objects')
export class DynamicObjectsController {
  private readonly logger = new Logger(DynamicObjectsController.name);

  constructor(private readonly dynamicObjectsService: DynamicObjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new dynamic object' })
  @ApiResponse({ status: 201, description: 'The dynamic object has been successfully created.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() createDynamicObjectDto: CreateDynamicObjectDto) {
    try {
      this.logger.log(`Creating new dynamic object...`);
      const result = await this.dynamicObjectsService.create(createDynamicObjectDto);
      this.logger.log(`Created dynamic object with ID: ${result.id}.`);
      return result;
    } catch (e) {
      throw e;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all dynamic objects' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all dynamic objects.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll() {
    this.logger.log('Starting to fetch all dynamic objects...');
    try {
      const dynamicObjects = await this.dynamicObjectsService.findAll();
      this.logger.log(`Successfully fetched ${dynamicObjects.length} dynamic objects.`);
      return dynamicObjects;
    } catch (error) {
      this.logger.error(`Failed to fetch dynamic objects: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch()
  @ApiOperation({ summary: 'Update a dynamic object' })
  @ApiResponse({ status: 200, description: 'The dynamic object has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(@Body() updateDynamicObjectDto: UpdateDynamicObjectDto) {
    try {
      this.logger.log(`Updating dynamic object with ID: ${updateDynamicObjectDto.id}...`);
      const result = await this.dynamicObjectsService.update(updateDynamicObjectDto);
      this.logger.log(`Updated dynamic object with ID: ${result.id}.`);
      return result;
    } catch (e) {
      this.logger.error(`Failed to update dynamic object: ${e.message}`, e.stack);
      throw e;
    }
  }

  @Post('many')
  @ApiOperation({ summary: 'Find dynamic objects based on criteria' })
  @ApiResponse({ status: 200, description: 'Successfully found dynamic objects.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findMany(@Body() findDynamicObjectsDto: FindDynamicObjectsDto) {
    try {
      this.logger.log(`Finding dynamic objects based on criteria...`);
      const dynamicObjects = await this.dynamicObjectsService.findMany(findDynamicObjectsDto);
      this.logger.log(`Found ${dynamicObjects.length} dynamic objects based on criteria.`);
      return dynamicObjects;
    } catch (error) {
      this.logger.error(`Failed to find dynamic objects: ${error.message}`, error.stack);
      throw error;
    }
  }
}

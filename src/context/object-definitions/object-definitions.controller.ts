import { Body, Controller, Get, Logger, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ObjectDefinitionsService } from '../../shared/context/object-definitions/object-definitions.service';
import { CreateObjectDefinitionDto } from '../../shared/context/object-definitions/domain/dtos/create-object-definitions.dto';
import { FindObjectDefinitionDto } from '../../shared/context/object-definitions/domain/dtos/find-object-definitions.dto';
import { UpdateObjectDefinitionDto } from '../../shared/context/object-definitions/domain/dtos/update-object-definitions.dto';
import { ObjectDefinition } from '@avantodev/avanto-db';

@ApiTags('Object Definitions')
@Controller('object-definitions')
export class ObjectDefinitionsController {
  private readonly logger = new Logger(ObjectDefinitionsController.name);

  constructor(private readonly objectDefinitionsService: ObjectDefinitionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new object definition' })
  @ApiResponse({ status: 201, description: 'The object definition has been successfully created.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 301, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() createObjectDefinitionDto: CreateObjectDefinitionDto): Promise<ObjectDefinition> {
    try {
      this.logger.log(`Creating new object definition...`);
      const result = await this.objectDefinitionsService.create(createObjectDefinitionDto);
      this.logger.log(
        `Created object definition with id: ${result.id} by user with id: ${createObjectDefinitionDto.createdById}.`,
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all object definitions' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all object definitions.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(): Promise<ObjectDefinition[] | undefined> {
    this.logger.log('Starting to fetch all object definitions...');
    try {
      const objectDefinitions = await this.objectDefinitionsService.findAll();
      this.logger.log(`Successfully fetched ${objectDefinitions.length} object definitions.`);
      return objectDefinitions;
    } catch (error) {
      this.logger.error(`Failed to fetch object definitions: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an object definition by id' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved object definition.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findOne(@Param('id') objectDefinitionId: number): Promise<ObjectDefinition | undefined> {
    this.logger.log(`Starting to fetch object definition with id: ${objectDefinitionId}...`);
    try {
      const objectDefinition = await this.objectDefinitionsService.findOne(objectDefinitionId);
      this.logger.log(`Successfully fetched object definition with id: ${objectDefinitionId}.`);
      return objectDefinition;
    } catch (error) {
      this.logger.error(`Failed to fetch object definitions: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('/many')
  @ApiOperation({ summary: 'Find many object definitions based on criteria' })
  @ApiResponse({ status: 200, description: 'Successfully found object definitions.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findMany(@Body() findObjectDefinitionDto: FindObjectDefinitionDto): Promise<ObjectDefinition[]> {
    this.logger.log(
      `Starting to find many object definitions with criteria: ${JSON.stringify(findObjectDefinitionDto)}`,
    );
    try {
      const foundObjectDefinitions = await this.objectDefinitionsService.findMany(findObjectDefinitionDto);
      this.logger.log(`Successfully found ${foundObjectDefinitions.length} object definitions matching criteria.`);
      return foundObjectDefinitions;
    } catch (error) {
      this.logger.error(
        `Failed to find object definitions with criteria: ${JSON.stringify(findObjectDefinitionDto)}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Patch()
  @ApiOperation({ summary: 'Update an object definition' })
  @ApiResponse({ status: 200, description: 'The object definition has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 301, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(@Body() updateObjectDefinitionDto: UpdateObjectDefinitionDto): Promise<ObjectDefinition> {
    this.logger.log(`Updating object definition with id: ${updateObjectDefinitionDto.id}...`);
    try {
      const result = await this.objectDefinitionsService.update(updateObjectDefinitionDto);
      this.logger.log(
        `Updated object definition with id: ${result.id} by user with id: ${updateObjectDefinitionDto.updatedById}.`,
      );
      return result;
    } catch (e) {
      this.logger.error(`Failed to update object definition: ${e.message}`, e.stack);
      throw e;
    }
  }
}

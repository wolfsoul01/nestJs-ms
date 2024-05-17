import { Body, Controller, Get, Post, Patch, Logger, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PageService } from 'src/shared/context/pages/pages.service';
import { CreatePageDto } from 'src/shared/context/pages/domain/dtos/create-pages.dto';
import { FindPageDto } from 'src/shared/context/pages/domain/dtos/find-pages.dto';
import { PageDto } from 'src/shared/context/pages/domain/dtos/pages.dto';
import { Pages } from '@avantodev/avanto-db';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  private readonly logger = new Logger(PagesController.name);

  constructor(private readonly pageService: PageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Page' })
  @ApiResponse({ status: 201, description: 'The Page has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() createPageDto: CreatePageDto): Promise<Pages | undefined> {
    try {
      this.logger.log(`Creating new Page...`);
      const result = await this.pageService.create(createPageDto);
      this.logger.log(`Created Page with id: ${result.id}.`);
      return result;
    } catch (e) {
      this.logger.error(`Failed to create Page: ${e.message}`, e.stack);
      throw e;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all Pages' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all Pages.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(): Promise<Pages[] | undefined> {
    try {
      this.logger.log('Starting to fetch all Pages...');
      const pages = await this.pageService.findMany(new FindPageDto());
      this.logger.log(`Successfully fetched ${pages.length} Pages.`);
      return pages;
    } catch (error) {
      this.logger.error(`Failed to fetch Pages: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('/many')
  @ApiOperation({ summary: 'Find many pages based on criteria' })
  @ApiResponse({ status: 200, description: 'Successfully found pages.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findMany(@Body() findPagesDto: FindPageDto): Promise<Pages[] | undefined> {
    try {
      this.logger.log(`Starting to find many pages with criteria: ${JSON.stringify(findPagesDto)}`);
      const foundObjectProperties = await this.pageService.findMany(findPagesDto);
      this.logger.log(`Successfully found ${foundObjectProperties.length} pages matching criteria.`);
      return foundObjectProperties;
    } catch (error) {
      this.logger.error(
        `Failed to find pages with criteria: ${JSON.stringify(findPagesDto)}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an Page by id' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved Page.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findOne(@Param('id') pageId: number): Promise<Pages | undefined> {
    this.logger.log(`Starting to fetch Page with id: ${pageId}...`);
    try {
      const page = await this.pageService.findOne(pageId);
      this.logger.log(`Successfully fetched Page with id: ${pageId}.`);
      return page;
    } catch (error) {
      this.logger.error(`Failed to fetch Pages: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch()
  @ApiOperation({ summary: 'Update an page' })
  @ApiResponse({ status: 200, description: 'The page has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(@Body() updatePageDto: PageDto): Promise<Pages | undefined> {
    try {
      this.logger.log(`Updating page with id: ${updatePageDto.id}...`);
      const result = await this.pageService.update(updatePageDto);
      this.logger.log(`Updated page with id: ${result.id}.`);
      return result;
    } catch (e) {
      this.logger.error(`Failed to update page: ${e.message}`, e.stack);
      throw e;
    }
  }
}

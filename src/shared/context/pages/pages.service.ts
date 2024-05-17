import { BadRequestException, Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { ObjectDefinitionsService } from '../object-definitions/object-definitions.service';
import { Pages } from '@avantodev/avanto-db';
import { dbConfig } from '@avantodev/avanto-shared-resources';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { CreatePageDto } from './domain/dtos/create-pages.dto';
import { PageDto } from './domain/dtos/pages.dto';
import { FindPageDto } from './domain/dtos/find-pages.dto';

@Injectable()
export class PageService {
  private readonly logger = new Logger(PageService.name);

  constructor(
    @InjectRepository(Pages, dbConfig.name)
    private readonly pagesRepository: Repository<Pages>,

    @Inject(forwardRef(() => ObjectDefinitionsService))
    private readonly objectDefinitionsService: ObjectDefinitionsService,
  ) {
    this.logger.log('PageService initialized');
  }

  async create(createPageDto: CreatePageDto): Promise<Pages> {
    this.logger.log(`Creating Page: ${JSON.stringify(createPageDto)}`);
    try {
      const { name, description, objectDefinitionId } = createPageDto;

      const foundedObjectDefinition = await this.objectDefinitionsService.findOne(objectDefinitionId);

      if (!foundedObjectDefinition) {
        this.logger.error(`Object definition with ID: ${objectDefinitionId} was not found.`);
        throw new NotFoundException(`Object definition with ID: ${objectDefinitionId} was not found.`);
      }

      const foundPageWithThatNameAndObjectDefinition = await this.pagesRepository.findOne({
        where: {
          name: name.trim(),
          objectDefinition: foundedObjectDefinition,
        },
      });

      if (foundPageWithThatNameAndObjectDefinition) {
        this.logger.error(
          `Page with name: ${name} and object definition with ID: ${objectDefinitionId} already exists.`,
        );
        throw new BadRequestException(
          `Page with name: ${name} and object definition with ID: ${objectDefinitionId} already exists.`,
        );
      }

      const savedPage = await this.pagesRepository.save({
        name: name.trim(),
        description: description?.trim(),
        objectDefinition: foundedObjectDefinition,
      });

      this.logger.log(`Page created with ID: ${savedPage.id}`);
      return savedPage;
    } catch (error) {
      this.logger.error(`Failed to create Page: ${error.message}`);
      throw error;
    }
  }

  async findMany(findPageDto: FindPageDto): Promise<Pages[] | null> {
    this.logger.log(`Finding many Pages with criteria: ${JSON.stringify(findPageDto)}`);
    try {
      const pages = await this.pagesRepository.find({
        where: {
          ...(findPageDto.id && { id: findPageDto.id }),
          ...(findPageDto.ids && { id: In(findPageDto.ids) }),
          ...(findPageDto.names && { name: In(findPageDto.names) }),
          ...(findPageDto.name && { name: findPageDto.name }),
          ...(findPageDto.objectDefinitionIds && {
            objectDefinition: { id: In(findPageDto.objectDefinitionIds) },
          }),
        },
        relations: ['objectDefinition'],
      });

      this.logger.debug(`Found ${pages.length} Pages`);
      return pages;
    } catch (error) {
      this.logger.error(`Failed to find many Pages: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: number): Promise<Pages | null> {
    this.logger.log(`Finding Page with ID: ${id}`);
    try {
      const page = await this.pagesRepository.findOne({
        where: { id },
        relations: ['objectDefinition'],
      });

      if (!page) {
        this.logger.warn(`Page with ID: ${id} not found`);
        throw new NotFoundException(`Page with ID: ${id} was not found.`);
      }

      this.logger.debug(`Found Page with ID: ${id}`);
      return page;
    } catch (error) {
      this.logger.error(`Failed to find Page with ID: ${id}, ${error.message}`);
      throw error;
    }
  }

  async update(updatePageDto: PageDto) {
    this.logger.log(`Updating Page: ${JSON.stringify(updatePageDto)}`);
    try {
      const { id, name, description, objectDefinitionId } = updatePageDto;

      const foundPage = await this.findOne(id);
      if (!foundPage) {
        this.logger.error(`Page with ID: ${id} was not found.`);
        throw new NotFoundException(`Page with ID: ${id} was not found.`);
      }

      const foundedObjectDefinition =
        objectDefinitionId && (await this.objectDefinitionsService.findOne(objectDefinitionId));
      if (!foundedObjectDefinition && objectDefinitionId) {
        this.logger.error(`Object definition with ID: ${objectDefinitionId} was not found.`);
        throw new NotFoundException(`Object definition with ID: ${objectDefinitionId} was not found.`);
      }

      const foundPageWithThatNameAndObjectDefinition = await this.pagesRepository.findOne({
        where: {
          name: name.trim(),
          objectDefinition: foundPage.objectDefinition,
          id: Not(foundPage.id),
        },
      });

      if (foundPageWithThatNameAndObjectDefinition) {
        this.logger.error(
          `Page with name: ${name} and object definition with ID: ${objectDefinitionId} already exists.`,
        );
        throw new BadRequestException(
          `Page with name: ${name} and object definition with ID: ${objectDefinitionId} already exists.`,
        );
      }

      const updatedObjectProperty = await this.pagesRepository.save({
        ...foundPage,
        name: name?.trim(),
        description: description?.trim(),
        objectDefinition: objectDefinitionId && foundedObjectDefinition,
      });

      this.logger.log(`Page with ID: ${id} updated successfully`);
      return updatedObjectProperty;
    } catch (error) {
      this.logger.error(`Failed to update Page: ${error.message}`);
      throw error;
    }
  }
}

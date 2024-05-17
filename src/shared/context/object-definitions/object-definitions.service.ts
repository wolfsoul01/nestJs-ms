import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ObjectDefinition } from '@avantodev/avanto-db';
import { InjectRepository } from '@nestjs/typeorm';
import { dbConfig } from '@avantodev/avanto-shared-resources';
import { In, Not, Repository } from 'typeorm';
import { CreateObjectDefinitionDto } from './domain/dtos/create-object-definitions.dto';
import { UpdateObjectDefinitionDto } from './domain/dtos/update-object-definitions.dto';
import { FindObjectDefinitionDto } from './domain/dtos/find-object-definitions.dto';
import { UsersService } from '../users/domain/users.service';

@Injectable()
export class ObjectDefinitionsService {
  private readonly logger = new Logger(ObjectDefinitionsService.name);

  constructor(
    @InjectRepository(ObjectDefinition, dbConfig.name)
    private objectDefinitionRepository: Repository<ObjectDefinition>,

    @Inject(UsersService)
    private usersService: UsersService,
  ) {
    this.logger.log('ObjectDefinitionsService initialized');
  }

  async create(createObjectDefinitionDto: CreateObjectDefinitionDto): Promise<ObjectDefinition> {
    const { createdById, name, description } = createObjectDefinitionDto;
    this.logger.log(
      `Creating Object Definition: ${JSON.stringify(createObjectDefinitionDto)} by User ID: ${createdById}`,
    );

    try {
      const foundCreatorUser = await this.usersService.findOne(createdById);
      this.logger.debug(`Found creator user with ID: ${createdById}`);

      if (!foundCreatorUser) {
        this.logger.warn(`User not found with ID: ${createdById}`);
        throw new NotFoundException(`Not found user with id:${createdById}`);
      }

      const foundObjectTypeWithName = await this.objectDefinitionRepository.findOne({
        where: {
          name,
        },
      });

      if (foundObjectTypeWithName) {
        this.logger.warn(`Object definition with name "${name}" already exists`);
        throw new ForbiddenException(`Object definition with that name already exists`);
      }

      const savedObjectDefinition = await this.objectDefinitionRepository.save({
        ...createObjectDefinitionDto,
        name: name.trim(),
        description: description?.trim(),
        createdBy: foundCreatorUser,
        updatedBy: foundCreatorUser,
      });

      this.logger.log(`Object Definition created with ID: ${savedObjectDefinition.id}`);
      return savedObjectDefinition;
    } catch (e) {
      this.logger.error(`Error creating Object Definition: ${e.message}`, e.stack);
      throw e;
    }
  }

  async findAll(): Promise<ObjectDefinition[] | null> {
    this.logger.log('Fetching all Object Definitions');
    try {
      const objectDefinitions = await this.objectDefinitionRepository.find({
        relations: ['createdBy', 'updatedBy', 'objectProperties'],
      });
      this.logger.debug(`Found ${objectDefinitions.length} Object Definitions`);
      return objectDefinitions;
    } catch (e) {
      this.logger.error(`Error fetching Object Definitions: ${e.message}`, {
        stack: e.stack,
      });
      throw e;
    }
  }

  async findMany(findObjectDefinitionDto: FindObjectDefinitionDto): Promise<ObjectDefinition[] | null> {
    this.logger.log(`Finding Object Definitions with criteria: ${JSON.stringify(findObjectDefinitionDto)}`);
    try {
      const objectDefinitions = await this.objectDefinitionRepository.find({
        where: {
          ...(findObjectDefinitionDto.id && { id: findObjectDefinitionDto.id }),
          ...(findObjectDefinitionDto.ids && { id: In(findObjectDefinitionDto.ids) }),
          ...(findObjectDefinitionDto.name && { name: findObjectDefinitionDto.name }),
          ...(findObjectDefinitionDto.names && { name: In(findObjectDefinitionDto.names) }),
          ...(findObjectDefinitionDto.description && { description: findObjectDefinitionDto.description }),
          ...(findObjectDefinitionDto.enabled !== undefined && { enabled: findObjectDefinitionDto.enabled }),
          ...(findObjectDefinitionDto.createdById && { createdBy: { id: findObjectDefinitionDto.createdById } }),
          ...(findObjectDefinitionDto.createdByIds && { createdBy: { id: In(findObjectDefinitionDto.createdByIds) } }),
          ...(findObjectDefinitionDto.updatedById && { updatedBy: { id: findObjectDefinitionDto.updatedById } }),
          ...(findObjectDefinitionDto.updatedByIds && { updatedBy: { id: In(findObjectDefinitionDto.updatedByIds) } }),
        },
        relations: ['createdBy', 'updatedBy', 'objectProperties'],
      });
      this.logger.debug(`Found ${objectDefinitions.length} Object Definitions matching criteria`);
      return objectDefinitions;
    } catch (e) {
      this.logger.error(
        `Error finding Object Definitions with criteria: ${JSON.stringify(findObjectDefinitionDto)}: ${e.message}`,
        { stack: e.stack },
      );
      throw e;
    }
  }

  async findOne(id: number): Promise<ObjectDefinition | null> {
    this.logger.log(`Initiating findOne with ID: ${id}`);
    try {
      const objectDefinition = await this.objectDefinitionRepository.findOne({
        where: { id },
        relations: ['createdBy', 'updatedBy', 'objectProperties', 'objectProperties.listType'],
      });
      if (!objectDefinition) {
        this.logger.warn(`Object Definition with ID ${id} not found`);
        throw new NotFoundException(`Object Definition with ID ${id} not found`);
      }
      this.logger.debug(`Successfully found Object Definition with ID: ${id}`);
      return objectDefinition;
    } catch (e) {
      this.logger.error(`Error finding Object Definition with ID ${id}: ${e.message}`, e.stack);
      throw e;
    }
  }

  async update(updateObjectDefinitionDto: UpdateObjectDefinitionDto): Promise<ObjectDefinition> {
    const { id, updatedById, name } = updateObjectDefinitionDto;
    this.logger.log(`Updating Object Definition with ID: ${id}`);
    try {
      const objectDefinition = await this.objectDefinitionRepository.findOne({
        where: { id },
        relations: ['createdBy', 'updatedBy', 'objectProperties'],
      });
      if (!objectDefinition) {
        throw new NotFoundException(`Object Definition with ID ${id} not found`);
      }
      //verify that the user exists
      if (!updatedById) {
        throw new BadRequestException('You must provide the user id that is updating the object definition');
      }

      const foundUpdaterUser = await this.usersService.findOne(updatedById);
      if (!foundUpdaterUser) {
        throw new NotFoundException(`User with ID ${updatedById} not found`);
      }

      //verify name doesn't exist already (except if is the same of this object)
      const foundObjectTypeWithName = await this.objectDefinitionRepository.findOne({
        where: {
          name: name,
          id: Not(id),
        },
      });

      if (foundObjectTypeWithName) {
        this.logger.warn(`Object definition with name "${name}" already exists`);
        throw new ForbiddenException(`Object definition with that name already exists`);
      }

      const updatedObjectDefinition = await this.objectDefinitionRepository.save({
        ...objectDefinition,
        ...updateObjectDefinitionDto,
        updatedBy: foundUpdaterUser,
      });
      this.logger.debug(`Object Definition with ID ${id} updated successfully`);
      return updatedObjectDefinition;
    } catch (e) {
      this.logger.error(`Error updating Object Definition with ID ${id}: ${e.message}`, {
        stack: e.stack,
      });
      throw e;
    }
  }
}

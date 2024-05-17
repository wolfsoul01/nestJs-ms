import { Module } from '@nestjs/common';
import { EntitiesModule } from '../entities/entities.module';
import { DynamicObjectsService } from 'src/shared/context/dynamic-objects/dynamic-objects.service';
import { DynamicObjectsController } from './dynamic-objects.controller';
import { ObjectDefinitionsModule } from '../object-definitions/object-definitions.module';

@Module({
  imports: [EntitiesModule, ObjectDefinitionsModule],
  controllers: [DynamicObjectsController],
  providers: [DynamicObjectsService],
  exports: [DynamicObjectsService],
})
export class DynamicObjectsModule {}

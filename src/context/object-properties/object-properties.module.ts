import { Module } from '@nestjs/common';
import { EntitiesModule } from '../entities/entities.module';
import { ObjectPropertiesService } from 'src/shared/context/object-properties/object-properties.service';
import { ObjectPropertiesController } from './object-properties.controller';
import { ObjectDefinitionsModule } from '../object-definitions/object-definitions.module';

@Module({
  imports: [EntitiesModule, ObjectDefinitionsModule],
  providers: [ObjectPropertiesService],
  controllers: [ObjectPropertiesController],
  exports: [ObjectPropertiesService],
})
export class ObjectPropertiesModule {}

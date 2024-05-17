import { Module } from '@nestjs/common';
import { EntitiesModule } from '../entities/entities.module';
import { ObjectValuesController } from './object-values.controller';
import { ObjectValuesService } from 'src/shared/context/object-values/object-values.service';
import { ObjectValuesMapper } from '../../shared/context/object-values/domain/mappers/object-values.mapper';
import { ObjectPropertiesModule } from '../object-properties/object-properties.module';
import { DynamicObjectsModule } from '../dynamic-objects/dynamic-objects.module';

@Module({
  imports: [EntitiesModule, DynamicObjectsModule, ObjectPropertiesModule],
  controllers: [ObjectValuesController],
  providers: [ObjectValuesService, ObjectValuesMapper],
  exports: [ObjectValuesService, ObjectValuesMapper],
})
export class ObjectValuesModule {}

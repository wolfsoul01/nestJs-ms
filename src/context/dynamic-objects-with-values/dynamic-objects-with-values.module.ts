import { Module } from '@nestjs/common';
import { EntitiesModule } from '../entities/entities.module';
import { ObjectValuesModule } from '../object-values/object-values.module';
import { DynamicObjectsModule } from '../dynamic-objects/dynamic-objects.module';
import { DynamicObjectsWithValuesController } from './dynamic-objects-with-values.controller';
import { DynamicObjectsWithValuesService } from 'src/shared/context/dynamic-objects-with-values/dynamic-objects-with-values.service';
import { ObjectDefinitionsModule } from '../object-definitions/object-definitions.module';

@Module({
  imports: [EntitiesModule, ObjectValuesModule, DynamicObjectsModule, ObjectDefinitionsModule],
  controllers: [DynamicObjectsWithValuesController],
  providers: [DynamicObjectsWithValuesService],
  exports: [DynamicObjectsWithValuesService],
})
export class DynamicObjectsWithValuesModule {}

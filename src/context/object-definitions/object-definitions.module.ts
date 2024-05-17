import { Module } from '@nestjs/common';
import { EntitiesModule } from '../entities/entities.module';
import { ObjectDefinitionsService } from 'src/shared/context/object-definitions/object-definitions.service';
import { ObjectDefinitionsController } from './object-definitions.controller';

@Module({
  imports: [EntitiesModule],
  providers: [ObjectDefinitionsService],
  controllers: [ObjectDefinitionsController],
  exports: [ObjectDefinitionsService],
})
export class ObjectDefinitionsModule {}

import { Module } from '@nestjs/common';
import { EntitiesModule } from '../entities/entities.module';
import { ObjectDefinitionsModule } from '../object-definitions/object-definitions.module';
import { PageService } from 'src/shared/context/pages/pages.service';
import { PagesController } from './pages.controller';

@Module({
  imports: [EntitiesModule, ObjectDefinitionsModule],
  providers: [PageService],
  controllers: [PagesController],
  exports: [PageService],
})
export class PagesModule {}

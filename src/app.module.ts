import { pinoOptions } from './shared/infrastructure/logger/pinoLoggerOptions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appPostgresDataSource } from './shared/infrastructure/persistance/postgre-sql/PostgresDataSource';
import { CorrelationIdMiddleware } from './shared/middleware/correlation-id/correlation-id.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntitiesModule } from './context/entities/entities.module';
import { ObjectDefinitionsModule } from './context/object-definitions/object-definitions.module';
import { ObjectPropertiesModule } from './context/object-properties/object-properties.module';
import { DynamicObjectsModule } from './context/dynamic-objects/dynamic-objects.module';
import { ObjectValuesModule } from './context/object-values/object-values.module';
import { DynamicObjectsWithValuesModule } from './context/dynamic-objects-with-values/dynamic-objects-with-values.module';
import { PagesModule } from './context/pages/pages.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(appPostgresDataSource),
    LoggerModule.forRoot(pinoOptions),
    EntitiesModule,
    ObjectDefinitionsModule,
    ObjectPropertiesModule,
    DynamicObjectsModule,
    ObjectValuesModule,
    DynamicObjectsWithValuesModule,
    PagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}

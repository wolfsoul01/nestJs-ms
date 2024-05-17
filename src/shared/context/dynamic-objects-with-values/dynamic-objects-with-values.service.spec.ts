import { Test, TestingModule } from '@nestjs/testing';
import { DynamicObjectsWithValuesService } from './dynamic-objects-with-values.service';

describe('DynamicObjectsWithValuesService', () => {
  let service: DynamicObjectsWithValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamicObjectsWithValuesService],
    }).compile();

    service = module.get<DynamicObjectsWithValuesService>(DynamicObjectsWithValuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

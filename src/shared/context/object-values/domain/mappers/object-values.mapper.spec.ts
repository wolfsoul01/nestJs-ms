import { Test, TestingModule } from '@nestjs/testing';
import { ObjectValuesMapper } from './object-values.mapper';
import { ListsValuesService } from '../../../../../shared/context/list-values/lists-values';
import { MapObjectValueDto } from '../dtos/object-values.dto';
import { ObjectPropertiesDataTypeEnum as DataTypeEnum } from '../../../../../shared/dataTypes/Enums';
import { objectPropertyStub } from '../../../../../shared/context/object-properties/domain/stubs/object-properties.stub';

describe('ObjectValuesMapper', () => {
  let mapper: ObjectValuesMapper;
  //let listsValuesService: ListsValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectValuesMapper,
        {
          provide: ListsValuesService,
          useValue: {
            findMany: jest.fn(),
          },
        },
      ],
    }).compile();

    mapper = module.get<ObjectValuesMapper>(ObjectValuesMapper);
    // listsValuesService = module.get<ListsValuesService>(ListsValuesService);
  });

  it('should be defined', () => {
    expect(mapper).toBeDefined();
  });

  describe('mapObjectValueWithDatatype', () => {
    it('should correctly map a string value', async () => {
      const mapObjectValueDto: MapObjectValueDto = {
        objectProperty: {
          ...objectPropertyStub,
          dataType: DataTypeEnum.String,
        },
        value: 'Test String',
      };

      const result = await mapper.mapObjectValueWithDatatype(mapObjectValueDto);
      expect(result.value).toEqual('Test String');
    });

    it('should correctly map a number value', async () => {
      const mapObjectValueDto: MapObjectValueDto = {
        objectProperty: {
          ...objectPropertyStub,
          dataType: DataTypeEnum.Number,
        },
        value: '123',
      };

      const result = await mapper.mapObjectValueWithDatatype(mapObjectValueDto);
      expect(result.value).toEqual('123');
    });

    it('should throw BadRequestException for invalid number value', async () => {
      const mapObjectValueDto: MapObjectValueDto = {
        objectProperty: {
          ...objectPropertyStub,
          dataType: DataTypeEnum.Number,
        },
        value: 'invalid',
      };

      await expect(mapper.mapObjectValueWithDatatype(mapObjectValueDto)).rejects.toThrow();
    });

    it('should correctly map a date value', async () => {
      const mapObjectValueDto: MapObjectValueDto = {
        objectProperty: {
          ...objectPropertyStub,
          dataType: DataTypeEnum.Date,
        },
        value: '2023-09-21',
      };

      const result = await mapper.mapObjectValueWithDatatype(mapObjectValueDto);
      expect(result.value).toEqual('2023-09-21');
    });
  });
});

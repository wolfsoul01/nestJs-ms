import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { ListsValuesService } from '../../../../../shared/context/list-values/lists-values';
import { MapObjectValueDto } from '../dtos/object-values.dto';
import { ObjectPropertiesDataTypeEnum as DataTypeEnum } from '../../../../../shared/dataTypes/Enums';
import { getObjectPropertiesDataTypeEnum } from '../../../../../shared/utils';
import { toISODateString, toISODateTimeString, toISOTimeString } from '../../../../../shared/utils';
import { ObjectValue } from '@avantodev/avanto-db';

@Injectable()
export class ObjectValuesMapper {
  private readonly logger = new Logger(ObjectValuesMapper.name);

  constructor(
    @Inject(ListsValuesService)
    private readonly listsValuesService: ListsValuesService,
  ) {}

  async mapObjectValueWithDatatype({
    objectProperty,
    value,
  }: MapObjectValueDto): Promise<
    | Omit<ObjectValue, 'tag' | 'belongsToObject' | 'createdAt' | 'updatedAt' | 'objectDefinition' | 'objectProperty'>
    | undefined
  > {
    try {
      const newObjectValue = new ObjectValue();

      const dataType = getObjectPropertiesDataTypeEnum(objectProperty.dataType);

      let correctedValue;

      if (value.trim() !== '') {
        if ([DataTypeEnum.Number, DataTypeEnum.Decimal].includes(dataType)) {
          correctedValue = isNaN(Number(value)) ? undefined : Number(value).toString();
        } else if (DataTypeEnum.Date === dataType) {
          correctedValue = toISODateString(value);
        } else if (DataTypeEnum.Datetime === dataType) {
          correctedValue = toISODateTimeString(value);
        } else if (DataTypeEnum.Time === dataType) {
          correctedValue = toISOTimeString(value);
        } else if (DataTypeEnum.List === dataType) {
          const foundListValue = await this.listsValuesService.findMany({
            ids: [Number(value)],
            listIds: [objectProperty.listType?.id],
          });
          if (!foundListValue.length) {
            throw new BadRequestException(`Does not exists the list value with id: ${value}`);
          }

          newObjectValue.listsValues = [foundListValue[0]];

          correctedValue = String(foundListValue[0].id);
        } else if (DataTypeEnum.Object === dataType) {
          //to define
        } else if (DataTypeEnum.Checkbox === dataType) {
          if (!(value.toLowerCase().trim() === 'true' || value.toLowerCase().trim() === 'false')) {
            throw new BadRequestException(`Checkbox datatype has only two possible options: true or false`);
          }

          correctedValue = value.toLowerCase().trim();
        } else if ([DataTypeEnum.Multiselect, DataTypeEnum.MultiselectCheckbox].includes(dataType)) {
          const foundListValues = await this.listsValuesService.findMany({
            ids: JSON.parse(value) as number[],
            listIds: [objectProperty.listType.id],
          });
          if (foundListValues.length !== JSON.parse(value).length) {
            throw new BadRequestException(`Does not exists some or all of the list values with ids: ${value}`);
          }

          newObjectValue.listsValues = foundListValues;

          correctedValue = JSON.stringify(foundListValues.sort((a, b) => a.id - b.id).map((listValue) => listValue.id));
        } else {
          correctedValue = value.trim();
        }
      } else {
        correctedValue = '';
      }

      if (correctedValue === undefined) {
        throw new BadRequestException(
          `Error while trying to save a ${dataType}. Value ${value} does not match with the proprty datatype`,
        );
      }

      newObjectValue.value = correctedValue;

      return newObjectValue;
    } catch (e) {
      this.logger.error(e.message, JSON.stringify(e.stack));
      throw e;
    }
  }
}

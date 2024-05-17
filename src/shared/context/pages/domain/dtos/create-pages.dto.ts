import { OmitType } from '@nestjs/swagger';
import { PageDto } from './pages.dto';

export class CreatePageDto extends OmitType(PageDto, ['id'] as const) {}

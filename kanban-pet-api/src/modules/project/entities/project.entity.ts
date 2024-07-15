import { ApiProperty } from '@nestjs/swagger';
import { SoftDeleteEntity } from 'src/base/base.entity';

export class Project extends SoftDeleteEntity {
  @ApiProperty()
  name: string;
}

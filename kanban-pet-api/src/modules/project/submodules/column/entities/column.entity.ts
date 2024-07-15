import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/base/base.entity';
import { OneToOne } from 'typeorm';
import { Status } from '../../status/entities/status.entity';

export class Column extends BaseEntity {
  @ApiProperty()
  order: number;

  @OneToOne(() => Status, (status) => status.column)
  status: Status;
}

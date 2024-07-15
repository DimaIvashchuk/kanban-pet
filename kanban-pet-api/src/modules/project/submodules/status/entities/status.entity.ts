import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/base/base.entity';
import { OneToMany, OneToOne } from 'typeorm';
import { Column } from '../../column/entities/column.entity';
import { Task } from 'src/modules/task/entities/task.entity';

export class Status extends BaseEntity {
  @ApiProperty()
  name: string;

  @ApiProperty()
  color: string;

  @OneToOne(() => Column, (column) => column.status)
  column: Column;

  @OneToMany(() => Task, (task) => task.status)
  tasks: Task[];
}

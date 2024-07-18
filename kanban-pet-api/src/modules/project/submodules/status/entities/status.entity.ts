import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Task } from 'src/modules/task/entities/task.entity';

@Entity({ name: 'project_statuses' })
export class Status extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  color: string;

  @OneToMany(() => Task, (task) => task.status)
  tasks: Task[];
}

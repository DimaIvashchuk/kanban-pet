import { ApiProperty } from '@nestjs/swagger';
import { SoftDeleteEntity } from 'src/base/base.entity';
import { Status } from 'src/modules/project/submodules/status/entities/status.entity';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'tasks' })
export class Task extends SoftDeleteEntity {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ManyToOne(() => Status, (status) => status.tasks)
  @JoinColumn()
  status: Status;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn()
  assignee: User;
}

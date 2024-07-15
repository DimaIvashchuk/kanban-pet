import { ApiProperty } from '@nestjs/swagger';
import { SoftDeleteEntity } from 'src/base/base.entity';
import { Status } from 'src/modules/project/submodules/status/entities/status.entity';
import { User } from 'src/modules/user/user.entity';
import { JoinColumn, ManyToOne } from 'typeorm';

export class Task extends SoftDeleteEntity {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ManyToOne(() => Status, (status) => status.tasks)
  status: Status;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn()
  assignee: User;
}

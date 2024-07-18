import { ApiProperty } from '@nestjs/swagger';
import { SoftDeleteEntity } from 'src/base/base.entity';
import { User } from 'src/modules/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ColumnEntity } from '../submodules/column/entities/column.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';

@Entity({ name: 'projects' })
export class Project extends SoftDeleteEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable({ name: 'users_projects' })
  users: User[];

  @OneToMany(() => ColumnEntity, (column) => column.project)
  columns: ColumnEntity[];

  @ManyToOne(() => Organization, (organization) => organization.projects)
  @JoinColumn({})
  organization: Organization;
}

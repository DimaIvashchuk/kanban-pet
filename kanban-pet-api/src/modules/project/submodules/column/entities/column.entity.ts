import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Status } from '../../status/entities/status.entity';
import { Project } from 'src/modules/project/entities/project.entity';

@Entity({ name: 'project_columns' })
export class ColumnEntity extends BaseEntity {
  @ApiProperty()
  @Column()
  order: number;

  @OneToOne(() => Status)
  @JoinColumn()
  status: Status;

  @ManyToOne(() => Project, (project) => project.columns)
  project: Project;
}

import { SoftDeleteEntity } from 'src/base/base.entity';
import { Project } from 'src/modules/project/entities/project.entity';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity({ name: 'organizations' })
export class Organization extends SoftDeleteEntity {
  @Column()
  name: string;

  @OneToMany(() => Project, (project) => project.organization)
  projects: Project[];

  @ManyToMany(() => User, (user) => user.organizations)
  @JoinTable({ name: 'users_organizations' })
  users: User[];
}

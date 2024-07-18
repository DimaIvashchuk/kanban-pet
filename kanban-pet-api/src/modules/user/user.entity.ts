import { SoftDeleteEntity } from 'src/base/base.entity';
import { Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { TAuth } from 'src/base/configuration';
import { Exclude } from 'class-transformer';
import { Task } from '../task/entities/task.entity';
import { Comment } from '../task/submodules/comment/entities/comment.entity';
import { Role } from '../roles/entities/role.entity';
import { Project } from '../project/entities/project.entity';
import { Organization } from '../organization/entities/organization.entity';

@Entity({ name: 'users' })
export class User extends SoftDeleteEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Index({ fulltext: true })
  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  dob: Date;

  @Exclude()
  @Column({ nullable: true })
  refreshTokenHash: string;

  issueJWTAccessToken(jwtConfig: TAuth): string {
    const accessToken = jwt.sign(
      {
        sub: this.id,
        fullName: `${this.firstName} ${this.lastName}`,
        email: this.email,
      },
      jwtConfig.jwt.access.secret,
      {
        expiresIn: jwtConfig.jwt.access.expiresIn,
      },
    );

    return 'Bearer ' + accessToken;
  }

  issueJWTRefreshToken(jwtConfig: TAuth): string {
    const refreshToken = jwt.sign(
      {
        sub: this.id,
      },
      jwtConfig.jwt.refresh.secret,
      {
        expiresIn: jwtConfig.jwt.refresh.expiresIn,
      },
    );

    const rTknHash = crypto
      .createHmac('sha256', jwtConfig.jwt.refresh.secret)
      .update(refreshToken)
      .digest('hex');

    this.refreshTokenHash = rTknHash;

    return refreshToken;
  }

  @OneToMany(() => Task, (task) => task.assignee)
  tasks: Task[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Role, (role) => role.user)
  roles: Role[];

  @ManyToMany(() => Project, (project) => project.users)
  projects: Project[];

  @ManyToMany(() => Organization, (organization) => organization.users)
  organizations: Organization[];
}

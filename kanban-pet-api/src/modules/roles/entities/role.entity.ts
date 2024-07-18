import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/base/base.entity';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @Column()
  @ApiProperty()
  scopes: string;

  @ManyToOne(() => User, (user) => user.roles)
  user: User;
}

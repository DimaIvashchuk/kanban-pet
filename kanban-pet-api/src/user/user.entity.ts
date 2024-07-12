import { SoftDeleteEntity } from 'src/base/base.entity';
import { Column, Entity, Index } from 'typeorm';

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
}

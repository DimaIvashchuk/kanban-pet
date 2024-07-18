import { SoftDeleteEntity } from 'src/base/base.entity';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
@Entity({ name: 'task_comments' })
export class Comment extends SoftDeleteEntity {
  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  author: string;
}

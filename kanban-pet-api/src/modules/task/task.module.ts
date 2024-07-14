import { Module } from '@nestjs/common';
import { CommentModule } from './submodules/comment/comment.module';

@Module({
  imports: [CommentModule]
})
export class TaskModule {}

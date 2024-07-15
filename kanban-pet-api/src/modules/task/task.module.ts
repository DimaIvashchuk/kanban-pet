import { Module } from '@nestjs/common';
import { CommentModule } from './submodules/comment/comment.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [CommentModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}

import { Module } from '@nestjs/common';
import { CommentModule } from './submodules/comment/comment.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Module({
  imports: [CommentModule, TypeOrmModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}

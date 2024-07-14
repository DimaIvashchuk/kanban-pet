import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { StatusModule } from './submodules/status/status.module';
import { ColumnModule } from './submodules/column/column.module';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [StatusModule, ColumnModule],
})
export class ProjectModule {}

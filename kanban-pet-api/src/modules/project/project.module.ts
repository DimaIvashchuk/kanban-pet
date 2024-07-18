import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { StatusModule } from './submodules/status/status.module';
import { ColumnModule } from './submodules/column/column.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [StatusModule, ColumnModule, TypeOrmModule.forFeature([Project])],
})
export class ProjectModule {}

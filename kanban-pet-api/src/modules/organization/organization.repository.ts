import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationRepository extends Repository<Organization> {
  constructor(
    @InjectRepository(Organization)
    repository: Repository<Organization>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}

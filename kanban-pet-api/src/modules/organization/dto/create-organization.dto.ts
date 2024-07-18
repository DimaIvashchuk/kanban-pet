import { PickType } from '@nestjs/swagger';
import { Organization } from '../entities/organization.entity';

export class CreateOrganizationDto extends PickType(Organization, ['name']) {}

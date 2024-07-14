import { PartialType } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UpdateUserDto extends PartialType(User) {}

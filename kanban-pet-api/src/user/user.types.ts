import { ApiProperty } from '@nestjs/swagger';

export class UserPlain {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  dob: Date;
}

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class IdEntity {
  @ApiProperty({ example: '1', description: 'Identifier' })
  @Column({ nullable: false })
  @Index({ unique: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

@Entity()
export class BaseEntity extends IdEntity {
  @ApiProperty({
    example: '2023-05-10 08:41:41.080901',
    description: 'Entity created at',
  })
  @CreateDateColumn({ type: 'timestamp' })
  @Index({ background: true, unique: false, sparse: true })
  createdAt: Date;

  @ApiProperty({
    example: '2023-05-10 08:41:41.080901',
    description: 'Entity updated at',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  @Index({ background: true, unique: false, sparse: true })
  updatedAt: Date;
}

@Entity()
export class SoftDeleteEntity extends BaseEntity {
  @ApiProperty({ example: null, description: 'When is Entity deleted' })
  @DeleteDateColumn({ type: 'timestamp' })
  @Index({ background: true, unique: false, sparse: true })
  deletedAt?: Date;
}

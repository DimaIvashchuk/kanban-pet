import { SoftDeleteEntity } from 'src/base/base.entity';
import { Column, Entity, Index } from 'typeorm';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { TAuth } from 'src/base/configuration';

@Entity({ name: 'users' })
export class User extends SoftDeleteEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Index({ fulltext: true })
  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({ nullable: true })
  refreshTokenHash: string;

  issueJWTAccessToken(jwtConfig: TAuth): string {
    const accessToken = jwt.sign(
      {
        sub: this.id,
        fullName: `${this.firstName} ${this.lastName}`,
        email: this.email,
      },
      jwtConfig.jwt.access.secret,
      {
        expiresIn: jwtConfig.jwt.access.expiresIn,
      },
    );

    return 'Bearer ' + accessToken;
  }

  issueJWTRefreshToken(jwtConfig: TAuth): string {
    const refreshToken = jwt.sign(
      {
        sub: this.id,
      },
      jwtConfig.jwt.refresh.secret,
      {
        expiresIn: jwtConfig.jwt.refresh.expiresIn,
      },
    );

    const rTknHash = crypto
      .createHmac('sha256', jwtConfig.jwt.refresh.secret)
      .update(refreshToken)
      .digest('hex');

    this.refreshTokenHash = rTknHash;

    return refreshToken;
  }
}

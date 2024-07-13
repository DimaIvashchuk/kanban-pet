import { SoftDeleteEntity } from 'src/base/base.entity';
import { Column, Entity, Index } from 'typeorm';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

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

  issueJWTAccessToken(jwtConfig: any): {
    token: string;
    token_type: string;
  } {
    const accessToken = jwt.sign(
      {
        id: this.id,
        fullName: `${this.firstName} ${this.lastName}`,
        email: this.email,
      },
      jwtConfig.accessSecret,
      {
        expiresIn: jwtConfig.accessExpiresIn,
      },
    );

    return {
      token_type: 'Bearer',
      token: accessToken,
    };
  }

  issueJWTRefreshToken(jwtConfig: any): {
    token: string;
    token_type: string;
  } {
    const refreshToken = jwt.sign(
      {
        id: this.id,
      },
      jwtConfig.refreshSecret,
      {
        expiresIn: jwtConfig.refreshExpiresIn,
      },
    );

    const rTknHash = crypto
      .createHmac('sha256', jwtConfig.refreshSecret)
      .update(refreshToken)
      .digest('hex');

    this.refreshTokenHash = rTknHash;

    return {
      token_type: 'Bearer',
      token: refreshToken,
    };
  }
}

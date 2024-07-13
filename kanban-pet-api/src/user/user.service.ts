import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dto/update.dto';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name);

  constructor(private userRepository: UserRepository) {}

  async create(dto: CreateUserDto) {
    try {
      const user = this.userRepository.create(dto);
      await this.userRepository.save(user);

      return user;
    } catch (ex) {
      throw ex;
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new Error('User not found');
      }

      this.userRepository.merge(user, dto);
      await this.userRepository.save(user);

      return user;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      return user;
    } catch (ex) {
      throw ex;
    }
  }
}

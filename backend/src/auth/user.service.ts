import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(email: string, password: string, displayName?: string) {
    const hash = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password_hash: hash, display_name: displayName });
    return this.userRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async verifyPassword(user: User, password: string) {
    if (!user || !user.password_hash) return false;
    return bcrypt.compare(password, user.password_hash);
  }
}

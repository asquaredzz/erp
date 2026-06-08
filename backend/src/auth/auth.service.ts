import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';


@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, @InjectRepository(User) private userRepo: Repository<User>, private userSvc: UserService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userSvc.findByEmail(email);
    if (!user) return null;
    const ok = await this.userSvc.verifyPassword(user, password);
    if (!ok) return null;
    return user;
  }

  async login(user: Partial<User>) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwt.sign(payload) };
  }
}

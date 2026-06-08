import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UserService) {}

  @Post('register')
  async register(@Body() body: any) {
    const { email, password, displayName } = body;
    const exists = await this.users.findByEmail(email);
    if (exists) return { error: 'User exists' };
    const u = await this.users.createUser(email, password, displayName);
    return { id: u.id, email: u.email };
  }

  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;
    const user = await this.auth.validateUser(email, password);
    if (!user) return { error: 'Invalid credentials' };
    return this.auth.login(user as any);
  }
}

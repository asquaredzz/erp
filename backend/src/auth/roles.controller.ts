import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Controller('admin/roles')
export class RolesController {
  constructor(private svc: RolesService, @InjectRepository(User) private userRepo: Repository<User>) {}

  @Get()
  list() {
    return this.svc.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.svc.create(body);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.svc.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }

  @Post(':id/assign')
  async assign(@Param('id') id: string, @Body('user_id') userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) return { error: 'User not found' };
    await this.userRepo.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, id]);
    return { ok: true };
  }
}

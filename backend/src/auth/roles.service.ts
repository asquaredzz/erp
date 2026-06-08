import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private repo: Repository<Role>) {}

  async create(data: Partial<Role>) {
    const r = this.repo.create(data as Role);
    return this.repo.save(r);
  }

  async findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  async update(id: string, data: Partial<Role>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.repo.delete(id);
  }
}

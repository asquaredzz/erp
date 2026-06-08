import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Controller('admin/permissions')
export class PermissionsController {
  constructor(private svc: PermissionsService) {}

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
}

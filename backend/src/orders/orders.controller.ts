import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private svc: OrdersService) {}

  @Post()
  @Roles('Sales Staff', 'Admin')
  async createOrder(@Body() body: any) {
    const { order, items } = body;
    return this.svc.createOrder(order, items || []);
  }
}

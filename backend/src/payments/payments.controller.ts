import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { InventoryService } from '../inventory/inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private ordersSvc: OrdersService, private inventorySvc: InventoryService) {}

  @Post('webhook')
  @Roles('Finance', 'Admin')
  async paymentWebhook(@Body() body: any) {
    // Expected body: { order_id, status, amount }
    const { order_id, status } = body;
    if (status === 'COMPLETED') {
      // finalize order: create SALE inventory transactions from reservations
      await this.ordersSvc.finalizeOrder(order_id);
      return { ok: true };
    }
    return { ok: false };
  }
}

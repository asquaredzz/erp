import { Controller, Post, Body } from '@nestjs/common';
import { ProcurementService } from './procurement.service';

@Controller('procurement')
export class ProcurementController {
  constructor(private svc: ProcurementService) {}

  @Post('purchase-orders')
  async createPO(@Body() body: any) {
    const { sku_id, quantity } = body;
    return this.svc.createPurchaseOrder(sku_id, quantity);
  }
}

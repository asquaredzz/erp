import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly svc: InventoryService) {}

  @Get('skus/:id')
  getSku(@Param('id') id: string) {
    return this.svc.getSkuById(id);
  }

  @Post('barcodes/scan')
  @Roles('Warehouse Staff','Sales Staff')
  scanBarcode(@Body('code') code: string) {
    return this.svc.findSkuByBarcode(code);
  }

  @Post('transactions')
  createTransaction(@Body() body: any) {
    return this.svc.createTransaction(body);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ProcurementService } from '../procurement/procurement.service';

@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);

  constructor(private procurementSvc: ProcurementService) {}

  // Simple rules engine: handle LOW_STOCK by creating a purchase order
  async handleEvent(event: any) {
    this.logger.log('Received event: ' + JSON.stringify(event));
    if (event?.type === 'LOW_STOCK') {
      this.logger.warn(`Low stock for SKU ${event.sku_id}, qty ${event.quantity}`);
      try {
        const qty = Math.max(1, (event.reorder_qty) || 10);
        const res = await this.procurementSvc.createPurchaseOrder(event.sku_id, qty);
        this.logger.log('Created PO: ' + JSON.stringify(res));
        return { action: 'created_po', result: res };
      } catch (err) {
        this.logger.error('Failed creating PO: ' + err.message);
        return { error: err.message };
      }
    }
    return { ok: true };
  }
}

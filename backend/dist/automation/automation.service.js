"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AutomationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationService = void 0;
const common_1 = require("@nestjs/common");
const procurement_service_1 = require("../procurement/procurement.service");
let AutomationService = AutomationService_1 = class AutomationService {
    constructor(procurementSvc) {
        this.procurementSvc = procurementSvc;
        this.logger = new common_1.Logger(AutomationService_1.name);
    }
    async handleEvent(event) {
        this.logger.log('Received event: ' + JSON.stringify(event));
        if ((event === null || event === void 0 ? void 0 : event.type) === 'LOW_STOCK') {
            this.logger.warn(`Low stock for SKU ${event.sku_id}, qty ${event.quantity}`);
            try {
                const qty = Math.max(1, (event.reorder_qty) || 10);
                const res = await this.procurementSvc.createPurchaseOrder(event.sku_id, qty);
                this.logger.log('Created PO: ' + JSON.stringify(res));
                return { action: 'created_po', result: res };
            }
            catch (err) {
                this.logger.error('Failed creating PO: ' + err.message);
                return { error: err.message };
            }
        }
        return { ok: true };
    }
};
AutomationService = AutomationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [procurement_service_1.ProcurementService])
], AutomationService);
exports.AutomationService = AutomationService;
//# sourceMappingURL=automation.service.js.map
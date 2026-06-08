import { Controller, Post, Body } from '@nestjs/common';
import { AutomationService } from './automation.service';

@Controller('automation')
export class AutomationController {
  constructor(private svc: AutomationService) {}

  @Post('events')
  async receiveEvent(@Body() body: any) {
    return this.svc.handleEvent(body);
  }
}

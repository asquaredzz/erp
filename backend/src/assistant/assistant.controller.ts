import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('assistant')
export class AssistantController {
  constructor(private svc: AssistantService) {}

  @Post('query')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  async query(@Body() body: { prompt: string; system?: string; model?: string; temperature?: number }) {
    const prompt = body?.prompt || '';
    const opts = { system: body?.system, model: body?.model, temperature: body?.temperature };
    return this.svc.query(prompt, opts);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  async history(@Query('limit') limit = '50') {
    const lim = parseInt(limit as string, 10) || 50;
    return this.svc.getHistory(lim);
  }
}

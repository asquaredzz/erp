import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from './inventory/inventory.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'erp',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: false
    }),
    InventoryModule,
    OrdersModule,
    AuthModule,
    require('./automation/automation.module').AutomationModule,
    require('./assistant/assistant.module').AssistantModule
  ],
  controllers: [require('./health/health.controller').HealthController],
  providers: []
})
export class AppModule {}

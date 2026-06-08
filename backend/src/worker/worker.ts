import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import Redis from 'ioredis';
import { AutomationService } from '../automation/automation.service';
import { createHash } from 'crypto';
import { DataSource } from 'typeorm';
import { ProcessedEvent } from '../automation/processed-event.entity';

async function bootstrap() {
  const appCtx = await NestFactory.createApplicationContext(AppModule);
  const automation = appCtx.get(AutomationService);
  const dataSource = appCtx.get(DataSource) as DataSource;

  const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
  console.log('Nest worker connected to Redis, subscribing to automation:events');
  await redis.subscribe('automation:events');
  redis.on('message', async (channel: string, message: string) => {
    try {
      console.log('Worker received', channel, message);
      const payload = JSON.parse(message);
      const hash = createHash('sha256').update(channel + '|' + message).digest('hex');

      // check processed_events
      const exists = await dataSource.getRepository(ProcessedEvent).findOneBy({ event_hash: hash });
      if (exists) {
        console.log('Skipping already processed event', hash);
        return;
      }

      // insert processed marker before handling to reduce duplicates on retries
      await dataSource.getRepository(ProcessedEvent).save({ event_hash: hash, payload });

      await automation.handleEvent(payload);
    } catch (err) {
      console.error('Worker failed to handle message', err);
    }
  });
}

bootstrap().catch((err) => {
  console.error('Worker bootstrap failed', err);
  process.exit(1);
});

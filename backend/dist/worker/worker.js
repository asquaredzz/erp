"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const ioredis_1 = require("ioredis");
const automation_service_1 = require("../automation/automation.service");
const crypto_1 = require("crypto");
const typeorm_1 = require("typeorm");
const processed_event_entity_1 = require("../automation/processed-event.entity");
async function bootstrap() {
    const appCtx = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const automation = appCtx.get(automation_service_1.AutomationService);
    const dataSource = appCtx.get(typeorm_1.DataSource);
    const redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://redis:6379');
    console.log('Nest worker connected to Redis, subscribing to automation:events');
    await redis.subscribe('automation:events');
    redis.on('message', async (channel, message) => {
        try {
            console.log('Worker received', channel, message);
            const payload = JSON.parse(message);
            const hash = (0, crypto_1.createHash)('sha256').update(channel + '|' + message).digest('hex');
            const exists = await dataSource.getRepository(processed_event_entity_1.ProcessedEvent).findOneBy({ event_hash: hash });
            if (exists) {
                console.log('Skipping already processed event', hash);
                return;
            }
            await dataSource.getRepository(processed_event_entity_1.ProcessedEvent).save({ event_hash: hash, payload });
            await automation.handleEvent(payload);
        }
        catch (err) {
            console.error('Worker failed to handle message', err);
        }
    });
}
bootstrap().catch((err) => {
    console.error('Worker bootstrap failed', err);
    process.exit(1);
});
//# sourceMappingURL=worker.js.map
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AssistantService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assistant_message_entity_1 = require("./assistant-message.entity");
let AssistantService = AssistantService_1 = class AssistantService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(AssistantService_1.name);
    }
    async query(prompt, opts = {}) {
        var _a, _b, _c;
        this.logger.log('Assistant query received');
        const apiKey = process.env.OPENAI_API_KEY;
        const model = opts.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
        const temperature = typeof opts.temperature === 'number' ? opts.temperature : 0.2;
        const max_tokens = opts.max_tokens || 800;
        if (!apiKey) {
            return { reply: `Assistant (mock): I received your prompt: ${prompt}` };
        }
        const systemPrompt = opts.system || process.env.ASSISTANT_SYSTEM_PROMPT || 'You are a helpful, concise, and accurate assistant for an ERP system.';
        try {
            const payload = {
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature,
                max_tokens
            };
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const text = await res.text();
                this.logger.error('OpenAI responded with non-OK: ' + res.status + ' ' + text);
                return { error: `OpenAI error ${res.status}` };
            }
            const data = await res.json();
            const reply = ((_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) || JSON.stringify(data);
            try {
                await this.dataSource.getRepository(assistant_message_entity_1.AssistantMessage).save({ prompt, reply, model, temperature });
            }
            catch (e) {
                this.logger.warn('Failed to persist assistant message: ' + ((e === null || e === void 0 ? void 0 : e.message) || e));
            }
            return { reply, raw: data };
        }
        catch (err) {
            this.logger.error('Assistant error: ' + ((err === null || err === void 0 ? void 0 : err.message) || err));
            try {
                await this.dataSource.getRepository(assistant_message_entity_1.AssistantMessage).save({ prompt, reply: `error: ${(err === null || err === void 0 ? void 0 : err.message) || String(err)}`, model, temperature });
            }
            catch (e) { }
            return { error: (err === null || err === void 0 ? void 0 : err.message) || String(err) };
        }
    }
    async getHistory(limit = 50) {
        try {
            const repo = this.dataSource.getRepository(assistant_message_entity_1.AssistantMessage);
            const rows = await repo.find({ order: { created_at: 'DESC' }, take: limit });
            return rows;
        }
        catch (e) {
            this.logger.warn('Failed to query assistant history: ' + e.message);
            return [];
        }
    }
};
AssistantService = AssistantService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AssistantService);
exports.AssistantService = AssistantService;
//# sourceMappingURL=assistant.service.js.map
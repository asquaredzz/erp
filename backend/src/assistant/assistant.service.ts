import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AssistantMessage } from './assistant-message.entity';

interface QueryOpts {
  system?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async query(prompt: string, opts: QueryOpts = {}) {
    this.logger.log('Assistant query received');
    const apiKey = process.env.OPENAI_API_KEY;
    const model = opts.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const temperature = typeof opts.temperature === 'number' ? opts.temperature : 0.2;
    const max_tokens = opts.max_tokens || 800;

    if (!apiKey) {
      // Local development fallback: canned but helpful response
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
      const reply = data?.choices?.[0]?.message?.content || JSON.stringify(data);

      // persist history (best-effort)
      try {
        await this.dataSource.getRepository(AssistantMessage).save({ prompt, reply, model, temperature });
      } catch (e: any) {
        this.logger.warn('Failed to persist assistant message: ' + (e?.message || e));
      }

      return { reply, raw: data };
    } catch (err: any) {
      this.logger.error('Assistant error: ' + (err?.message || err));
      // persist failed attempt
      try {
        await this.dataSource.getRepository(AssistantMessage).save({ prompt, reply: `error: ${err?.message || String(err)}`, model, temperature });
      } catch (e) {}
      return { error: err?.message || String(err) };
    }
  }

  async getHistory(limit = 50) {
    try {
      const repo = this.dataSource.getRepository(AssistantMessage);
      const rows = await repo.find({ order: { created_at: 'DESC' }, take: limit });
      return rows;
    } catch (e) {
      this.logger.warn('Failed to query assistant history: ' + (e as any).message);
      return [];
    }
  }
}

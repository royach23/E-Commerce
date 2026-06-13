import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS = 'REDIS';

@Global()
@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: () => {
        const host = process.env.REDIS_HOST || 'localhost';
        const client = new Redis({
          host,
          port: 6379,
          // Prevent application from crashing if Redis is unavailable on startup
          maxRetriesPerRequest: null,
        });
        client.on('error', (err) => {
          console.error('Redis connection error:', err);
        });
        return client;
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}

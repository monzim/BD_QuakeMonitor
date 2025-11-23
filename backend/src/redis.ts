import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    console.warn('REDIS_URL not found in environment variables. Caching will be disabled or fail.');
}

export const redis = redisUrl ? new Redis(redisUrl) : null;

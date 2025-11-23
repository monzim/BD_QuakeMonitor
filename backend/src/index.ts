import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { fetchBangladeshEarthquakes } from './services/usgsService.js';
import { analyzeEarthquakeData } from './services/geminiService.js';
import { EarthquakeFeature } from './types.js';

const app = new Hono();

app.use('/*', cors());

app.get('/', (c) => {
    return c.text('BD Quake Monitor Backend is Running!');
});

app.get('/api/earthquakes', async (c) => {
    try {
        const data = await fetchBangladeshEarthquakes();
        return c.json(data);
    } catch (error) {
        return c.json({ error: 'Failed to fetch earthquake data' }, 500);
    }
});

app.post('/api/analyze', async (c) => {
    try {
        const body = await c.req.json();
        const quakes = body.quakes as EarthquakeFeature[];

        if (!quakes) {
            return c.json({ error: 'No earthquake data provided' }, 400);
        }

        const analysis = await analyzeEarthquakeData(quakes);
        return c.json(analysis);
    } catch (error) {
        return c.json({ error: 'Failed to analyze data' }, 500);
    }
});

import { z } from 'zod';
import { prisma } from './db.js';

const alertSchema = z.object({
    locationName: z.string().optional().or(z.literal('')),
    phoneNumber: z.string().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    discordWebhook: z.string().url().optional().or(z.literal('')),
    minMagnitude: z.number().min(0).max(10),
    notificationsEnabled: z.boolean()
});

app.post('/api/alerts', async (c) => {
    try {
        const body = await c.req.json();
        const result = alertSchema.safeParse(body);

        if (!result.success) {
            return c.json({ error: 'Invalid input', details: result.error.format() }, 400);
        }

        const data = result.data;

        // Check if user already exists (by phone or email)
        if (data.phoneNumber) {
            const existing = await prisma.userAlert.findUnique({ where: { phoneNumber: data.phoneNumber } });
            if (existing) {
                // Update existing? Or return error? For now, let's update.
                const updated = await prisma.userAlert.update({
                    where: { id: existing.id },
                    data: {
                        locationName: data.locationName || existing.locationName,
                        minMagnitude: data.minMagnitude,
                        notificationsEnabled: data.notificationsEnabled,
                        discordWebhook: data.discordWebhook || existing.discordWebhook,
                        email: data.email || existing.email
                    }
                });
                return c.json({ success: true, id: updated.id, message: "Updated existing preferences" });
            }
        }

        if (data.email) {
            const existing = await prisma.userAlert.findUnique({ where: { email: data.email } });
            if (existing) {
                const updated = await prisma.userAlert.update({
                    where: { id: existing.id },
                    data: {
                        locationName: data.locationName || existing.locationName,
                        minMagnitude: data.minMagnitude,
                        notificationsEnabled: data.notificationsEnabled,
                        discordWebhook: data.discordWebhook || existing.discordWebhook,
                        phoneNumber: data.phoneNumber || existing.phoneNumber
                    }
                });
                return c.json({ success: true, id: updated.id, message: "Updated existing preferences" });
            }
        }

        // Save to DB
        const alert = await prisma.userAlert.create({
            data: {
                locationName: data.locationName || null,
                phoneNumber: data.phoneNumber || null,
                email: data.email || null,
                discordWebhook: data.discordWebhook || null,
                minMagnitude: data.minMagnitude,
                notificationsEnabled: data.notificationsEnabled
            }
        });

        return c.json({ success: true, id: alert.id });
    } catch (error) {
        console.error('Failed to save alert preference:', error);
        return c.json({ error: 'Failed to save alert preference' }, 500);
    }
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port
});

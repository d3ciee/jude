import type { Config } from 'drizzle-kit';

export default {
    schema: './src/lib/server/db/schema.ts',
    out: './.migrations',
    dialect: "turso",
    dbCredentials: {
        authToken: process.env.DB_AUTH_TOKEN!,
        url: process.env.DB_URL!,
    },
    breakpoints: true
} satisfies Config;
import type { Config } from 'drizzle-kit';

export default {
    schema: './src/lib/server/db/schema.ts',
    out: './.migrations',
    dialect: "turso",
    dbCredentials: {
        url: "file:./.data/local.sqlite",
    },
    breakpoints: true
} satisfies Config;
import type { Config } from 'drizzle-kit';

export default {
    schema: './src/lib/infra/db/schema.ts',
    out: './.migrations',
    dialect: "turso",
    dbCredentials: {
        url: "file:./.data/local.sqlite",
    },
    breakpoints: true
} satisfies Config;
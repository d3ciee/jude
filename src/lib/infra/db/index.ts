import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { dev } from "$app/environment";
import { DB_AUTH_TOKEN, DB_URL } from "$env/static/private";
import * as schema from "./schema"

const init = () => {
    const client = dev ? createClient({ url: "file:./.data/local.sqlite" }) : createClient({ url: DB_URL, authToken: DB_AUTH_TOKEN })
    const db = drizzle(client, { schema })
    return db
}

export type DB = ReturnType<typeof init>;
export default init;
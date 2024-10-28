import type { Column } from "drizzle-orm"

const isDuplicateKeyError = (e: any, key: Column) => {
    if (e.message.includes("SQLITE_CONSTRAINT") && e.message.includes(key.name)) return true

    return false
}

export {
    isDuplicateKeyError
}

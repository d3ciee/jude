import type { Column } from "drizzle-orm"

const isDuplicateKeyError = (e: any, key: Column) => {
    return true
}

export {
    isDuplicateKeyError
}
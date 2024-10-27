import { nanoid } from "nanoid";

const genId = (length = 7) => nanoid(length);
export default genId;
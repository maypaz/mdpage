import { PAGE_ID_CHARSET, PAGE_ID_LENGTH } from "../config/constants";

export function generateId(): string {
  const bytes = new Uint8Array(PAGE_ID_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => PAGE_ID_CHARSET[byte % PAGE_ID_CHARSET.length]).join("");
}

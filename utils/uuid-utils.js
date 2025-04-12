import { Buffer } from 'buffer';
import { v4 as uuidv4, parse as uuidParse, stringify as uuidStringify } from 'uuid';

/**
 * Convierte un UUID string a un Buffer de 16 bytes
 */
export function parseUUIDToBuffer(uuid) {
  return Buffer.from(uuidParse(uuid));
}

/**
 * Convierte un Buffer de 16 bytes a UUID string
 */
export function parseBufferToUUID(buffer) {
  return uuidStringify(buffer);
}

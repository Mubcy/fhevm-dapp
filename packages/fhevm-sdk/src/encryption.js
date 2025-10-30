// src/encryption.js
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

/**
 * Returns a 32-byte (256-bit) symmetric key as hex.
 */
export function generateSymmetricKeyHex() {
  return randomBytes(32).toString('hex');
}

/**
 * Encrypt plaintext (string or Buffer) with a hex key.
 * Returns { ivHex, authTagHex, ciphertextHex } (all hex strings).
 */
export function encryptDataWithKeyHex(keyHex, plaintext) {
  const key = Buffer.from(keyHex, 'hex');
  if (key.length !== 32) throw new Error('Key must be 32 bytes (hex string length 64)');
  const iv = randomBytes(12); // 96-bit recommended for GCM
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const pt = typeof plaintext === 'string' ? Buffer.from(plaintext, 'utf8') : Buffer.from(plaintext);
  const ciphertext = Buffer.concat([cipher.update(pt), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    ivHex: iv.toString('hex'),
    authTagHex: authTag.toString('hex'),
    ciphertextHex: ciphertext.toString('hex'),
  };
}

/**
 * Decrypt (hex args) -> utf8 string.
 */
export function decryptDataWithKeyHex(keyHex, ivHex, authTagHex, ciphertextHex) {
  const key = Buffer.from(keyHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const ciphertext = Buffer.from(ciphertextHex, 'hex');
  if (key.length !== 32) throw new Error('Key must be 32 bytes (hex string length 64)');
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  const pt = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return pt.toString('utf8');
}

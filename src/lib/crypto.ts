import crypto from "crypto";

const algorithm = "aes-256-cbc";

// ENCRYPTION_KEY must be 32 bytes (64 hex characters). 
const keyStr = process.env.ENCRYPTION_KEY;

if (!keyStr) {
  throw new Error("CRITICAL: ENCRYPTION_KEY environment variable is not defined!");
}

const key = Buffer.from(keyStr, "hex");

if (key.length !== 32) {
  throw new Error(`CRITICAL: ENCRYPTION_KEY must be 32 bytes (64 hex characters). Current length: ${key.length} bytes`);
}
const ivLength = 16;

/**
 * Encrypts a string using AES-256-CBC
 * @param text 
 * @returns iv:encryptedData
 */
export function encrypt(text: string): string {
  if (!text) return text;
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypts an encrypted string
 * @param text Format: iv:encryptedData
 * @returns 
 */
export function decrypt(text: string): string {
  if (!text || !text.includes(":")) return text;
  try {
    const [ivHex, encryptedHex] = text.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err: any) {
    console.error("Decryption failed:", err.message);
    return text;
  }
}

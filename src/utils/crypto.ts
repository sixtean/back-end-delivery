import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = crypto.createHash("sha256").update(String(process.env.CRYPTO_KEY || "minha_chave_super_secreta")).digest("base64").substring(0, 32);
const IV_LENGTH = 16;

export const encryptBuffer = (buffer: Buffer): Buffer => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return Buffer.concat([iv, encrypted]);
}

export const decryptBuffer = (encrypted: Buffer): Buffer => {
    const iv = encrypted.subarray(0, IV_LENGTH);
    const content = encrypted.subarray(IV_LENGTH);
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
    return decrypted
}
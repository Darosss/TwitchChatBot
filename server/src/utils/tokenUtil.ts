import crypto from "crypto";

const algorithm = "aes-256-cbc";
const ivSize = 16;

export const encryptToken = (
  token: string,
  encryptionKey: string
): { iv: Buffer; encrypted: string } => {
  const iv = crypto.randomBytes(ivSize);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(encryptionKey),
    iv
  );
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv, encrypted: encrypted };
};

export const decryptToken = (
  encryptedToken: string,
  iv: Buffer,
  encryptionKey: string
): string => {
  const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
  let decrypted = decipher.update(encryptedToken, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

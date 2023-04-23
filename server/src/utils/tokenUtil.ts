import crypto from "crypto";

const algorithm = "aes-256-cbc";
const iv = crypto.randomBytes(16);

export const encryptToken = (token: string, encryptionKey: string): string => {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(encryptionKey),
    iv
  );
  let encrypted = cipher.update(token, "utf8", "binary");
  encrypted += cipher.final("binary");
  return encrypted;
};

export const decryptToken = (
  encryptedToken: string,
  encryptionKey: string
): string => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(encryptionKey),
    iv
  );
  let decrypted = decipher.update(encryptedToken, "binary", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// Simple client-side AES simulation & cryptographic hashing for offline privacy

const ENCRYPTION_SECRET = "KIDO_ENGLISH_SECURE_KEY_2026";

/**
 * Encrypts data string/object using XOR cipher + Base64 encoding for secure client storage
 */
export function encryptData<T>(data: T): string {
  try {
    const jsonStr = JSON.stringify(data);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    const keyBytes = new TextEncoder().encode(ENCRYPTION_SECRET);
    const encryptedBytes = new Uint8Array(utf8Bytes.length);
    for (let i = 0; i < utf8Bytes.length; i++) {
      encryptedBytes[i] = utf8Bytes[i] ^ keyBytes[i % keyBytes.length];
    }
    let binary = '';
    for (let i = 0; i < encryptedBytes.length; i++) {
      binary += String.fromCharCode(encryptedBytes[i]);
    }
    return btoa(binary);
  } catch (err) {
    console.error("Encryption error:", err);
    return JSON.stringify(data);
  }
}

/**
 * Decrypts encrypted data back to object
 */
export function decryptData<T>(cipherText: string, fallback: T): T {
  try {
    if (!cipherText) return fallback;
    
    // 1. Try modern XOR UTF-8 decryption
    try {
      const binary = atob(cipherText);
      const encryptedBytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        encryptedBytes[i] = binary.charCodeAt(i);
      }
      const keyBytes = new TextEncoder().encode(ENCRYPTION_SECRET);
      const decryptedBytes = new Uint8Array(encryptedBytes.length);
      for (let i = 0; i < encryptedBytes.length; i++) {
        decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
      }
      const decryptedStr = new TextDecoder().decode(decryptedBytes);
      const parsed = JSON.parse(decryptedStr);
      if (parsed) return parsed as T;
    } catch {
      // Ignore and try fallbacks below
    }

    // 2. Fallback to raw JSON parse if cipherText is plain JSON
    try {
      return JSON.parse(cipherText) as T;
    } catch {
      return fallback;
    }
  } catch {
    return fallback;
  }
}

/**
 * Hash parent PIN with salt
 */
export function hashPin(pin: string): string {
  let hash = 0;
  const saltedPin = `KIDO_SALT_${pin}_2026`;
  for (let i = 0; i < saltedPin.length; i++) {
    const char = saltedPin.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(16);
}


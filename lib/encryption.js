import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

// Helper function to get the encryption key dynamically
function getKey() {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-32-character-key-change';
  console.log('[ENCRYPTION DEBUG] Key length:', ENCRYPTION_KEY.length, 'First 8 chars:', ENCRYPTION_KEY.substring(0, 8));
  return crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
}


export function encrypt(text) {
  const KEY = getKey(); // Get key dynamically
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text) {
  const KEY = getKey(); // Get key dynamically
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = parts.join(':');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export class SecurityUtils {
      static async hashPassword(password: string): Promise<{ 
      hashedPassword: string, 
    }> {

      const usedSalt = "73892c5d-f43a-4a94-b52a-221378801234";

      const encoder = new TextEncoder();
      const passwordBuffer = encoder.encode(password);
      const saltBuffer = encoder.encode(usedSalt);
  
      const importedKey = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
  
      const derivedKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: saltBuffer,
          iterations: 10000,
          hash: 'SHA-256'
        },
        importedKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
  
      const exportedKey = await crypto.subtle.exportKey('raw', derivedKey);
      
      const hashedPassword = Array.from(new Uint8Array(exportedKey))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
  
      return {
        hashedPassword,
      };
    }
  }
  
  export default SecurityUtils;
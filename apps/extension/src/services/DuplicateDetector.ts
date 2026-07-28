import { db, type PersistentDownloadRecord } from '../db/downloadDatabase';
import { sanitizeFilename, type MediaType } from '@mediadock/shared';

export type DuplicateStrategy = 'skip' | 'rename' | 're_download' | 'ask';

export interface DuplicateCheckInput {
  filename: string;
  mediaType: MediaType;
  size?: number;
  chatFingerprint?: string;
}

export interface DuplicateResult {
  isDuplicate: boolean;
  signature: string;
  existingRecord?: PersistentDownloadRecord;
}

export class DuplicateDetector {
  /**
   * Generates a fast duplicate signature based on media type, sanitized filename, size, and chat fingerprint.
   */
  public static generateSignature(input: DuplicateCheckInput): string {
    const cleanName = sanitizeFilename(input.filename).toLowerCase();
    const cleanChat = (input.chatFingerprint || 'default_chat').toLowerCase().replace(/[^a-z0-9]/g, '_');
    const sizeStr = input.size ? input.size.toString() : 'unknown_size';
    return `${input.mediaType}:${cleanName}:${sizeStr}:${cleanChat}`;
  }

  /**
   * Checks if a completed download matching the duplicate signature already exists in IndexedDB.
   */
  public static async checkDuplicate(input: DuplicateCheckInput): Promise<DuplicateResult> {
    const signature = DuplicateDetector.generateSignature(input);

    try {
      const records = await db.getByDuplicateSignature(signature);
      const completedRecord = records.find((r) => r.status === 'completed');

      if (completedRecord) {
        return {
          isDuplicate: true,
          signature,
          existingRecord: completedRecord,
        };
      }
    } catch {
      // Fallback if DB is unavailable
    }

    return {
      isDuplicate: false,
      signature,
    };
  }
}

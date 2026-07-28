import { describe, it, expect } from 'vitest';
import { sanitizeFilename, formatBytes } from './index';

describe('Shared Utilities', () => {
  describe('sanitizeFilename', () => {
    it('removes illegal filename characters', () => {
      const input = 'my:cool*file?name.png';
      const output = sanitizeFilename(input);
      expect(output).toBe('my_cool_file_name.png');
    });

    it('strips leading path traversal dots and directory paths', () => {
      const input = '../../../etc/passwd';
      const output = sanitizeFilename(input, 'txt');
      expect(output).toBe('passwd.txt');
    });

    it('truncates filename stem while preserving extension', () => {
      const longName = 'a'.repeat(300) + '.png';
      const output = sanitizeFilename(longName);
      expect(output.endsWith('.png')).toBe(true);
      expect(output.length).toBeLessThanOrEqual(200);
    });
  });

  describe('formatBytes', () => {
    it('formats bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
    });
  });
});

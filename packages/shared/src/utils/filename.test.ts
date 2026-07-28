import { describe, it, expect } from 'vitest';
import { sanitizeFilename, generateCollisionSafeFilename } from './index';

describe('Filename Sanitizer & Collision Prevention', () => {
  it('replaces illegal OS characters and path slashes', () => {
    expect(sanitizeFilename('file/name?.mp4')).toBe('name.mp4');
    expect(sanitizeFilename('folder\\sub:item*tag<val>|pipe.jpg')).toBe('sub_item_tag_val__pipe.jpg');
    expect(sanitizeFilename('clean:item*tag<val>|pipe.jpg')).toBe('clean_item_tag_val__pipe.jpg');
  });

  it('handles Windows reserved filenames safely', () => {
    expect(sanitizeFilename('CON.png')).toBe('_CON.png');
    expect(sanitizeFilename('NUL.txt')).toBe('_NUL.txt');
    expect(sanitizeFilename('com1.pdf')).toBe('_com1.pdf');
  });

  it('safely preserves Unicode names', () => {
    expect(sanitizeFilename('照片_2026.png')).toBe('照片_2026.png');
    expect(sanitizeFilename('Аудио_отчет.mp3')).toBe('Аудио_отчет.mp3');
  });

  it('truncates extremely long filenames while keeping extension', () => {
    const longStem = 'a'.repeat(250);
    const result = sanitizeFilename(`${longStem}.png`);
    expect(result.endsWith('.png')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(200);
  });

  it('supplies default extension fallback when extension is missing', () => {
    expect(sanitizeFilename('media_file', 'mp4')).toBe('media_file.mp4');
    expect(sanitizeFilename('', 'jpg')).toBe('mediadock_file.jpg');
  });

  it('generates collision-safe sequential numbers', () => {
    const existing = new Set(['photo.jpg', 'photo (1).jpg']);
    expect(generateCollisionSafeFilename('photo.jpg', existing)).toBe('photo (2).jpg');
  });
});

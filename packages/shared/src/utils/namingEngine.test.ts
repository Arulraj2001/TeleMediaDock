import { describe, it, expect } from 'vitest';
import {
  parseNamingTemplate,
  sanitizePathSegment,
  getCleanExtension,
  getBaseName,
} from './namingEngine';

describe('namingEngine', () => {
  it('should substitute variable tokens correctly', () => {
    const result = parseNamingTemplate(
      '{chat}_{type}_{date}_{index}',
      'MediaDock/{chat}/',
      {
        chatLabel: 'Tech Community',
        senderLabel: 'Alex Dev',
        originalFilename: 'architecture.png',
        mediaType: 'image',
        timestamp: '2026-07-28T12:00:00Z',
        index: 1,
      }
    );

    expect(result).toBe('MediaDock/Tech Community/Tech Community_image_2026-07-28_001.png');
  });


  it('should sanitize illegal OS characters and path traversal sequences', () => {
    const sanitized = sanitizePathSegment('../../secret/file:name?.png');
    expect(sanitized).toBe('secret_file_name_.png');
    expect(sanitized).not.toContain('..');
    expect(sanitized).not.toContain(':');
    expect(sanitized).not.toContain('?');
  });

  it('should parse folder subpaths safely', () => {
    const result = parseNamingTemplate(
      '{original}',
      'MediaDock/{year}/{month}/{chat}/',
      {
        chatLabel: 'Design/Team:Alpha',
        originalFilename: 'mockup.png',
        mediaType: 'image',
        timestamp: '2026-07-28T12:00:00Z',
      }
    );

    expect(result).toBe('MediaDock/2026/07/Design_Team_Alpha/mockup.png');
  });

  it('should extract base name and clean extension properly', () => {
    expect(getBaseName('document.final.v2.pdf')).toBe('document.final.v2');
    expect(getCleanExtension('document.final.v2.pdf')).toBe('pdf');
    expect(getCleanExtension('no_ext', 'image/jpeg')).toBe('jpg');
  });
});

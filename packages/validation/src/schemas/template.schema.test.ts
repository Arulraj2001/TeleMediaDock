import { describe, it, expect } from 'vitest';
import { FilenameTemplateSchema } from './template.schema';

describe('FilenameTemplateSchema', () => {
  it('accepts valid template patterns', () => {
    const valid = {
      id: 'tmpl_1',
      name: 'Chat Date Index',
      pattern: '{chat}/{date}_{index}',
      isDefault: true,
    };
    expect(FilenameTemplateSchema.parse(valid)).toBeDefined();
  });

  it('rejects patterns with path traversal dots', () => {
    const invalid = {
      id: 'tmpl_2',
      name: 'Path Traversal Attempt',
      pattern: '../{chat}/{date}',
      isDefault: false,
    };
    expect(() => FilenameTemplateSchema.parse(invalid)).toThrow();
  });
});

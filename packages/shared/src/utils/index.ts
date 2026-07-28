const WINDOWS_RESERVED_NAMES = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;

export function sanitizeFilename(filename: string, defaultExt = 'bin'): string {
  if (!filename || typeof filename !== 'string') {
    return `mediadock_file.${defaultExt}`;
  }

  // 1. Normalize Unicode text (NFC) & strip path traversal slashes/backslashes
  let cleanName = filename.normalize('NFC').replace(/\\/g, '/');
  // Remove path directory prefixes (take basename)
  const lastSlashIndex = cleanName.lastIndexOf('/');
  if (lastSlashIndex >= 0) {
    cleanName = cleanName.slice(lastSlashIndex + 1);
  }
  cleanName = cleanName.trim();

  // 2. Separate extension from stem name
  const lastDotIndex = cleanName.lastIndexOf('.');
  let stem = lastDotIndex > 0 ? cleanName.slice(0, lastDotIndex) : cleanName;
  let ext = lastDotIndex > 0 ? cleanName.slice(lastDotIndex + 1) : '';

  // 3. Remove illegal OS characters
  stem = stem.replace(/[/\\?<>:*|\0]/g, '_').trim();
  ext = ext.replace(/[/\\?<>:*|\0\s]/g, '').trim();

  // 4. Handle missing extension with default fallback
  if (!ext) {
    ext = defaultExt;
  }

  // 5. Replace dot sequences and leading/trailing dots or underscores in stem
  stem = stem.replace(/\.{2,}/g, '.').replace(/^[._]+|[._]+$/g, '');


  // 6. Handle Windows reserved filenames (e.g., CON, PRN, AUX)
  if (WINDOWS_RESERVED_NAMES.test(stem)) {
    stem = `_${stem}`;
  }

  if (!stem) {
    stem = 'mediadock_file';
  }

  // 7. Truncate long stem if total filename exceeds 200 characters
  const maxStemLength = Math.max(10, 200 - ext.length - 1);
  if (stem.length > maxStemLength) {
    stem = stem.slice(0, maxStemLength);
  }

  return `${stem}.${ext}`;
}

export function generateCollisionSafeFilename(baseName: string, existingNames: Set<string>): string {
  if (!existingNames.has(baseName)) {
    return baseName;
  }

  const lastDotIndex = baseName.lastIndexOf('.');
  const stem = lastDotIndex > 0 ? baseName.slice(0, lastDotIndex) : baseName;
  const ext = lastDotIndex > 0 ? baseName.slice(lastDotIndex) : '';

  let counter = 1;
  let candidate = `${stem} (${counter})${ext}`;

  while (existingNames.has(candidate)) {
    counter++;
    candidate = `${stem} (${counter})${ext}`;
  }

  return candidate;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export * from './namingEngine';


import type { MediaType, UserPlanTier } from '../types';

export interface NamingContext {
  chatLabel?: string;
  senderLabel?: string;
  originalFilename: string;
  mediaType: MediaType;
  timestamp?: number | string | Date;
  index?: number;
  mimeType?: string;
}

export interface NamingPreset {
  id: string;
  label: string;
  template: string;
  folderTemplate: string;
  tier: UserPlanTier;
}

export const FREE_NAMING_PRESETS: NamingPreset[] = [
  {
    id: 'chat_date_index',
    label: 'Chat + Date + Index',
    template: '{chat}_{date}_{index}',
    folderTemplate: 'MediaDock/',
    tier: 'free',
  },
  {
    id: 'original',
    label: 'Original Filename',
    template: '{original}',
    folderTemplate: 'MediaDock/',
    tier: 'free',
  },
];

export const PRO_NAMING_PRESETS: NamingPreset[] = [
  {
    id: 'by_chat_type',
    label: 'Organized by Chat & Type',
    template: '{chat}_{type}_{date}_{index}',
    folderTemplate: 'MediaDock/{chat}/{type}/',
    tier: 'pro',
  },
  {
    id: 'by_year_month',
    label: 'Organized by Date (Year/Month)',
    template: '{date}_{sender}_{original}',
    folderTemplate: 'MediaDock/{year}/{month}/{chat}/',
    tier: 'pro',
  },
];

export const AVAILABLE_TOKENS = [
  { token: '{chat}', label: 'Chat Name', description: 'Active conversation title' },
  { token: '{sender}', label: 'Sender', description: 'Sender name or user' },
  { token: '{date}', label: 'Date', description: 'YYYY-MM-DD' },
  { token: '{time}', label: 'Time', description: 'HH-mm-ss' },
  { token: '{datetime}', label: 'Date & Time', description: 'YYYY-MM-DD_HH-mm-ss' },
  { token: '{type}', label: 'Media Type', description: 'image, video, document, etc.' },
  { token: '{original}', label: 'Original Name', description: 'Original filename without extension' },
  { token: '{extension}', label: 'Extension', description: 'File extension (e.g. png, mp4)' },
  { token: '{index}', label: 'Index', description: '3-digit counter (e.g. 001)' },
  { token: '{year}', label: 'Year', description: '4-digit year (YYYY)' },
  { token: '{month}', label: 'Month', description: '2-digit month (MM)' },
  { token: '{day}', label: 'Day', description: '2-digit day (DD)' },
] as const;

/**
 * Sanitizes a single filename or directory segment to prevent path traversal and invalid OS characters.
 */
export function sanitizePathSegment(segment: string): string {
  if (!segment) return 'unnamed';

  return segment
    .normalize('NFC')
    // Remove dangerous path traversal sequences
    .replace(/\.\.[/\\]/g, '')
    // Replace forbidden OS characters with underscore
    // eslint-disable-next-line no-control-regex
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')

    // Trim spaces and trailing dots
    .trim()
    .replace(/\.+$/, '')
    // Truncate segment length to 200 chars
    .slice(0, 200) || 'unnamed';
}

/**
 * Extract clean extension from filename or fallback MIME type
 */
export function getCleanExtension(filename: string, mimeType?: string): string {
  const parts = filename.split('.');
  const lastPart = parts[parts.length - 1];
  if (parts.length > 1 && lastPart && lastPart.trim()) {
    return sanitizePathSegment(lastPart.toLowerCase());
  }


  const mimeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'audio/ogg': 'ogg',
    'audio/mp3': 'mp3',
    'application/pdf': 'pdf',
  };

  return mimeMap[mimeType || ''] || 'bin';
}

/**
 * Extract base name without extension
 */
export function getBaseName(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex <= 0) return sanitizePathSegment(filename);
  return sanitizePathSegment(filename.slice(0, lastDotIndex));
}

/**
 * Parses and generates target file path using template and metadata context.
 */
export function parseNamingTemplate(
  template: string,
  folderTemplate: string,
  context: NamingContext
): string {
  const dateObj = context.timestamp ? new Date(context.timestamp) : new Date();
  const validDate = !isNaN(dateObj.getTime()) ? dateObj : new Date();

  const year = validDate.getFullYear().toString();
  const month = (validDate.getMonth() + 1).toString().padStart(2, '0');
  const day = validDate.getDate().toString().padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const hours = validDate.getHours().toString().padStart(2, '0');
  const minutes = validDate.getMinutes().toString().padStart(2, '0');
  const seconds = validDate.getSeconds().toString().padStart(2, '0');
  const timeStr = `${hours}-${minutes}-${seconds}`;
  const datetimeStr = `${dateStr}_${timeStr}`;

  const ext = getCleanExtension(context.originalFilename, context.mimeType);
  const base = getBaseName(context.originalFilename);
  const chat = sanitizePathSegment(context.chatLabel || 'Chat');
  const sender = sanitizePathSegment(context.senderLabel || 'User');
  const indexStr = (context.index || 1).toString().padStart(3, '0');

  const replacements: Record<string, string> = {
    '{chat}': chat,
    '{sender}': sender,
    '{date}': dateStr,
    '{time}': timeStr,
    '{datetime}': datetimeStr,
    '{type}': context.mediaType,
    '{original}': base,
    '{extension}': ext,
    '{index}': indexStr,
    '{year}': year,
    '{month}': month,
    '{day}': day,
  };

  // Substitute folder template
  let folderPath = folderTemplate || 'MediaDock/';
  Object.entries(replacements).forEach(([token, val]) => {
    folderPath = folderPath.replaceAll(token, val);
  });

  // Substitute filename template
  let filename = template || '{chat}_{date}_{index}';
  Object.entries(replacements).forEach(([token, val]) => {
    filename = filename.replaceAll(token, val);
  });

  // Sanitize folder subsegments
  const folderSegments = folderPath
    .split('/')
    .filter(Boolean)
    .map(sanitizePathSegment)
    .filter((s) => s !== 'unnamed');


  const cleanFilename = sanitizePathSegment(filename);
  const finalPath = [...folderSegments, `${cleanFilename}.${ext}`].join('/');

  return finalPath;
}

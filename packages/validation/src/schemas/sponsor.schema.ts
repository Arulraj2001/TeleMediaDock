import { z } from 'zod';

export const SponsorCardSchema = z.object({
  id: z.string().min(1),
  label: z.literal('Sponsored'),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(250),
  imageUrl: z.string().url().refine((url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' && (
        parsed.hostname === 'cdn.mediadock.app' || 
        parsed.hostname === 'mediadock.app' ||
        parsed.hostname.endsWith('.mediadock.app')
      );
    } catch {
      return false;
    }
  }, { message: 'Image URL must originate from an approved domain' }),
  destinationUrl: z.string().url().refine((url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' && (
        parsed.hostname === 'mediadock.app' ||
        parsed.hostname.endsWith('.mediadock.app')
      );
    } catch {
      return false;
    }
  }, { message: 'Destination URL must originate from an approved domain' }),
  campaignStart: z.string().datetime(),
  campaignEnd: z.string().datetime(),
});

export type SponsorCard = z.infer<typeof SponsorCardSchema>;

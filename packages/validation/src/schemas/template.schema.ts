import { z } from 'zod';

export const FilenameTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50),
  pattern: z.string().min(1).refine((pat) => !pat.includes('..'), {
    message: 'Path traversal sequences (..) are not allowed in filename templates',
  }),
  isDefault: z.boolean().default(false),
});

export type FilenameTemplate = z.infer<typeof FilenameTemplateSchema>;

import { z } from 'zod';

export const SelectorHealthReportSchema = z.object({
  adapterVersion: z.string().min(1),
  telegramVariant: z.enum(['webk', 'webz', 'webA', 'unknown']),
  failedSelectorId: z.string().min(1).regex(/^[a-zA-Z0-9_.-]+$/, {

    message: 'Selector ID must be a clean identifier without raw HTML or page content',
  }),
  extensionVersion: z.string().min(1),
});

export type SelectorHealthReportInput = z.infer<typeof SelectorHealthReportSchema>;

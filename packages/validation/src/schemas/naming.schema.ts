import { z } from 'zod';

export const NamingTemplateSchema = z.object({
  template: z.string().min(1, 'Naming template cannot be empty'),
  folderTemplate: z.string().min(1, 'Folder template cannot be empty'),
  presetId: z.string().optional(),
});

export const PerChatNamingRuleSchema = z.object({
  chatId: z.string().min(1),
  chatLabel: z.string(),
  template: z.string().min(1),
  folderTemplate: z.string().min(1),
});

export type NamingTemplateInput = z.infer<typeof NamingTemplateSchema>;
export type PerChatNamingRuleInput = z.infer<typeof PerChatNamingRuleSchema>;

import { z } from 'zod';

export const notiMetadataSchema = z.record(
  z.object({
    feature: z.string(),
    content: z.string(),
  }),
);

export const getNotiSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  bodyMarkdown: z.string(),
  createdDate: z.date(),
  readStatus: z.number(),
  data: notiMetadataSchema,
});

export const getNotiStatisticSchema = z.object({
  TotalUnread: z.number(),
});

export type GetNotiSchema = z.infer<typeof getNotiSchema>;
export type GetNotiStatisticSchema = z.infer<typeof getNotiStatisticSchema>;
export type NotiMetadataSchemaType = z.infer<typeof notiMetadataSchema>;

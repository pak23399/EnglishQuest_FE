import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Không được để trống.' }),
    newPassword: z
      .string()
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
    confirmNewPassword: z.string().min(1, { message: 'Không được để trống.' }),
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        path: ['confirmNewPassword'],
        code: 'custom',
        message: 'Mật khẩu xác nhận không khớp.',
      });
    }
  });

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;

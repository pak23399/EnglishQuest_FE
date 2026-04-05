import { z } from 'zod';

export const getSigninSchema = () => {
  return z.object({
    username: z
      .string()
      .min(1, { message: 'Vui lòng nhập tên đăng nhập.' }),
    password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu.' }),
    rememberMe: z.boolean().optional(),
  });
};

export type SigninSchemaType = z.infer<ReturnType<typeof getSigninSchema>>;

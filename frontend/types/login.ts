import { z } from 'zod';

export type LoginData = {
  email: string;
  password: string;
  termsOfService: boolean;
};

export const LoginSchema: z.ZodType<LoginData> = z.object({
  email: z
    .string()
    .min(1, { message: 'login.error.email.input' })
    .email('login.error.email.valid'),
  password: z.string().min(1, {
    message: 'login.error.password.input',
  }),
  termsOfService: z.literal<boolean>(true, {
    errorMap: () => ({ message: 'login.error.termsOfService.accept' }),
  }),
});

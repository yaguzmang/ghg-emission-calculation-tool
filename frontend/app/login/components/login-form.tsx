import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { LoginSchema } from '@/types/login';

interface LoginFormProps {
  onSubmit: (data: z.infer<typeof LoginSchema>) => void;
  error: string;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, error, isLoading }: LoginFormProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <h4 className="uppercase">{t('login.email')}</h4>
      <FormInput
        id="email"
        type="email"
        className="max-w-xs"
        {...form.register('email')}
        errorMessage={
          form.formState?.errors?.email?.message !== undefined
            ? t(form.formState.errors.email?.message)
            : undefined
        }
      />
      <h4 className="uppercase mt-9">{t('login.password')}</h4>
      <FormInput
        id="password"
        type="password"
        className="max-w-xs"
        {...form.register('password')}
        errorMessage={
          form.formState?.errors?.password?.message !== undefined
            ? t(form.formState.errors.password?.message)
            : undefined
        }
      />
      <span className="block text-destructive h-5 min-w-0">
        {error.length ? error : null}
      </span>
      <div className="mt-5">
        <Button type="submit" disabled={isLoading}>
          <span className="px-4 font-bold">{t('login')}</span>
        </Button>
      </div>
    </form>
  );
}

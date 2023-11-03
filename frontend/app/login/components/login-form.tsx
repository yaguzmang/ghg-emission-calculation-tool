'use client';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { useGetGeneralSettingsByLocaleQuery } from '@/redux/api/settings/generalSettingsApiSlice';
import { useSelectedLocale } from '@/redux/store/ui/shared';
import { LoginSchema } from '@/types/login';

interface LoginFormProps {
  onSubmit: (data: z.infer<typeof LoginSchema>) => void;
  error: string;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, error, isLoading }: LoginFormProps) {
  const { t } = useTranslation();
  const selectedLocale = useSelectedLocale();

  const generalSettings = useGetGeneralSettingsByLocaleQuery(
    selectedLocale ?? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string),
  );

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
      <h4 className="mt-9 uppercase">{t('login.password')}</h4>
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
      <div className="mt-5 flex items-center">
        <FormInput
          type="checkbox"
          value=""
          className="h-4 w-4 accent-secondary"
          {...form.register('termsOfService')}
        />
        <div className="flex items-center">
          <span className="pl-2 text-base text-secondary">
            {t('login.termsOfService.accept')}
          </span>
          <a
            target="_blank"
            href={
              generalSettings.currentData?.data.attributes.termsOfServiceLink
                ?.url
            }
            rel="noreferrer"
          >
            <span className="pl-1 text-base text-secondary underline">
              {
                generalSettings.currentData?.data.attributes.termsOfServiceLink
                  ?.label
              }
            </span>
          </a>
        </div>
      </div>
      {form.formState?.errors?.termsOfService?.message !== undefined ? (
        <span className="block h-5 min-w-0 text-sm text-destructive">
          {t(form.formState.errors.termsOfService?.message)}
        </span>
      ) : null}
      <span className="block h-5 min-w-0 text-destructive">
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

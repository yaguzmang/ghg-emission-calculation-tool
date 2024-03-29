'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { LoginForm } from './components/login-form';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginData } from '@/types/login';

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
  const [error, setError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const onSubmitHandler = async (data: LoginData) => {
    try {
      setError('');
      setIsLoginLoading(true);
      const loginResponse = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl,
      });
      if (!loginResponse?.error) {
        router.push(callbackUrl);
        return;
      }
      if (loginResponse?.error === 'CredentialsSignin') {
        setError(t('login.error.invalidCredentials'));
      } else {
        setError(t('login.error.api.generic'));
      }
    } catch (_) {
      setError(t('login.error.api.generic'));
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <main className="relative mx-2 mt-10 flex justify-center sm:mx-12">
      <div className="mt-6 w-full max-w-[1328px]">
        <Tabs value="login" className="relative mr-auto w-full">
          <div className="flex w-full items-center justify-between">
            <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
              <TabsTrigger
                value="login"
                className="relative w-full justify-start rounded-none border-b-[3px] border-b-transparent bg-transparent px-4 py-0 text-2xl font-semibold text-primary shadow-none data-[state=active]:border-b-secondary data-[state=active]:text-secondary data-[state=active]:shadow-none md:px-0"
              >
                <span className="pb-2 uppercase md:pl-2">{t('login')}</span>
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex min-h-[350px] w-full bg-white shadow-strong">
            <TabsContent value="login" className="h-full w-full">
              <div className="h-full w-full px-4 py-14 sm:px-14">
                <LoginForm
                  onSubmit={onSubmitHandler}
                  error={error}
                  isLoading={isLoginLoading}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}

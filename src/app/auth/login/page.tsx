'use client';

import { useForm } from 'react-hook-form';
import { login, signup } from '../actions';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';

const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t('auth.emailRequired') })
      .email({ message: t('auth.emailInvalid') }),
    password: z.string().min(6, { message: t('auth.passwordMinLength') }),
  });

export default function LoginPage() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const loginSchema = createLoginSchema(t);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (isSignup) {
        await signup(data);
      } else {
        await login(data);
      }
      queryClient.invalidateQueries();
      form.reset();
    } catch (error) {
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        return;
      }
      console.error(error);
      form.setError('root', {
        message: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    form.reset();
    form.clearErrors();
  };

  return (
    <div className="flex w-full items-center justify-center px-4 py-6 md:px-6 md:py-8 my-4 md:my-6">
      <Card className="max-w-md w-full">
        <CardHeader className="flex justify-center items-center gap-4">
          <CardTitle className="text-center text-lg font-extrabold">
            {isSignup ? t('auth.signUpTitle') : t('auth.signInTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.emailLabel')}</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder={t('auth.emailPlaceholder')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.passwordLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder={t('auth.passwordPlaceholder')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button variant="secondary" type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSignup ? t('auth.signingUp') : t('auth.signingIn')}
                  </>
                ) : isSignup ? (
                  t('actions.signup')
                ) : (
                  t('actions.login')
                )}
              </Button>

              {form.formState.errors.root && (
                <Alert variant="destructive">
                  <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link-secondary" onClick={toggleMode} type="button" className="text-sm">
            {isSignup ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

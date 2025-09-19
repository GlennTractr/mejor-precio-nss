'use client';

import { useForm } from 'react-hook-form';
import { changePassword } from '../auth/actions';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, Shield } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useRouter } from 'next/navigation';

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

const createChangePasswordSchema = (t: (key: string) => string) =>
  z.object({
    currentPassword: z.string().min(1, { message: t('auth.currentPasswordRequired') }),
    newPassword: z.string().min(6, { message: t('auth.passwordMinLength') }),
    confirmPassword: z.string().min(1, { message: t('auth.confirmPasswordRequired') }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: t('auth.passwordsDoNotMatch'),
    path: ['confirmPassword'],
  });

export default function ChangePasswordPage() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Create schema and form at the top level
  const changePasswordSchema = createChangePasswordSchema(t);
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (currentUser.status === 'success' && !currentUser.data) {
      router.push('/auth/login?next=' + encodeURIComponent('/change-password'));
    }
  }, [currentUser.status, currentUser.data, router]);

  // Show loading while checking authentication
  if (currentUser.status === 'pending' || (currentUser.status === 'success' && !currentUser.data)) {
    return (
      <div className="flex w-full items-center justify-center px-4 py-6 md:px-6 md:py-8 my-4 md:my-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">
                  {t('auth.checkingAuthentication')}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {t('common.pleaseWait')}
                </p>
              </div>
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    setIsLoading(true);
    setIsSuccess(false);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      queryClient.invalidateQueries();
      form.reset();
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      form.setError('root', {
        message: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center px-4 py-6 md:px-6 md:py-8 my-4 md:my-6">
      <Card className="max-w-md w-full">
        <CardHeader className="flex justify-center items-center gap-4">
          <CardTitle className="text-center text-lg font-extrabold">
            {t('navigation.changePassword')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-green-700">
                  {t('auth.passwordChangedSuccessfully')}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {t('auth.passwordChangeSuccess')}
                </p>
              </div>
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={() => setIsSuccess(false)}
              >
                {t('auth.changeAnotherPassword')}
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.currentPasswordLabel')}</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            placeholder={t('auth.currentPasswordPlaceholder')} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.newPasswordLabel')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder={t('auth.newPasswordPlaceholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.confirmPasswordLabel')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder={t('auth.confirmPasswordPlaceholder')}
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
                      {t('auth.changingPassword')}
                    </>
                  ) : (
                    t('actions.changePassword')
                  )}
                </Button>

                {form.formState.errors.root && (
                  <Alert variant="destructive">
                    <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
                  </Alert>
                )}
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
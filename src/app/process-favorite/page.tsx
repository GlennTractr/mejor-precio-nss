'use client';

import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import supabaseClient from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ProcessFavoritePage() {
  const currentUser = useCurrentUser();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'processing' | 'redirecting' | 'error'>(
    'loading'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const t = useTranslations();

  useEffect(() => {
    // Only run if we're in the browser
    if (typeof window === 'undefined') {
      return;
    }

    // Check if user is logged in
    if (currentUser.isLoading) {
      return;
    }

    // If user is not logged in, this is an error state
    // They should have been redirected to login first
    if (!currentUser.data?.id) {
      setStatus('error');
      setErrorMessage(t('favorites.loginRequired'));
      return;
    }

    const processFavorite = async () => {
      try {
        setStatus('processing');

        // Get the pending favorite from localStorage
        const pendingFavoriteId = localStorage.getItem('pendingFavorite');
        const redirectUrl = localStorage.getItem('redirectAfterLogin') || '/';

        if (!pendingFavoriteId) {
          // No pending favorite, just redirect
          setStatus('redirecting');
          window.location.href = redirectUrl;
          return;
        }

        // We've already checked that currentUser.data exists above
        const userId = currentUser.data!.id;

        // Check if the favorite already exists
        const { data: existingFavorite, error: checkError } = await supabaseClient
          .from('product_favory')
          .select('id')
          .eq('product', pendingFavoriteId)
          .eq('owner', userId)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking existing favorite:', checkError);
          setStatus('error');
          setErrorMessage('Failed to check if product is already in favorites');
          return;
        }

        // If it doesn't exist, add it
        if (!existingFavorite) {
          const { error: insertError } = await supabaseClient.from('product_favory').insert({
            product: pendingFavoriteId,
            owner: userId,
          });

          if (insertError) {
            console.error('Error adding favorite:', insertError);
            setStatus('error');
            setErrorMessage('Failed to add product to favorites');
            return;
          }

          toast({
            title: 'Success',
            description: 'Product added to favorites',
          });
        }

        // Clear the pending favorite
        localStorage.removeItem('pendingFavorite');

        // Redirect to the original page
        setStatus('redirecting');
        window.location.href = redirectUrl;
      } catch (error) {
        console.error('Error processing favorite:', error);
        setStatus('error');
        setErrorMessage('An unexpected error occurred');
      }
    };

    // Process the favorite with a small delay to ensure everything is loaded
    const timeoutId = setTimeout(processFavorite, 500);

    return () => clearTimeout(timeoutId);
  }, [currentUser.data?.id, currentUser.isLoading, toast, t]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 md:px-6">
      {status === 'loading' && (
        <>
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t('common.loading')}</h1>
          <p className="text-muted-foreground">{t('common.pleaseWait')}</p>
        </>
      )}

      {status === 'processing' && (
        <>
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t('favorites.processing')}</h1>
          <p className="text-muted-foreground">{t('common.pleaseWait')}</p>
        </>
      )}

      {status === 'redirecting' && (
        <>
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t('common.redirecting')}</h1>
          <p className="text-muted-foreground">{t('common.pleaseWait')}</p>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 className="text-2xl font-bold mb-2 text-destructive">{t('common.error')}</h1>
          <p className="text-muted-foreground mb-4">
            {errorMessage || t('common.unexpectedError')}
          </p>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={() => (window.location.href = '/')}
          >
            {t('actions.goHome')}
          </button>
        </>
      )}
    </div>
  );
}

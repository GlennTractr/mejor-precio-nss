'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { setLanguageCookie } from '@/lib/cookies';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { getAcceptedLocales } from '@/lib/env';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const t = useTranslations();
  const [language, setLanguage] = useState<string>('en');
  const [acceptedLocales, setAcceptedLocales] = useState<string[]>([]);

  // Get initial language from cookie and accepted locales on mount
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const langCookie = cookies.find(cookie => cookie.trim().startsWith('NEXT_LOCALE='));
    if (langCookie) {
      setLanguage(langCookie.split('=')[1]);
    }

    // Get accepted locales from environment
    setAcceptedLocales(getAcceptedLocales());
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    setLanguage(newLocale);
    setLanguageCookie(newLocale);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('settings.title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">{t('settings.theme.label')}</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue placeholder={t('settings.theme.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t('settings.theme.light')}</SelectItem>
                <SelectItem value="dark">{t('settings.theme.dark')}</SelectItem>
                <SelectItem value="system">{t('settings.theme.system')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">{t('settings.language.label')}</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language">
                <SelectValue placeholder={t('settings.language.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {acceptedLocales.map(locale => (
                  <SelectItem key={locale} value={locale}>
                    {LANGUAGE_LABELS[locale] || locale}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Twitter, Facebook, Instagram } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="w-full border-t bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Main Content Row */}
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:gap-12">
          {/* Left: Logo + Description */}
          <div className="flex-shrink-0 lg:max-w-md">
            <h3 className="text-xl font-bold text-primary">SaveOnBaby</h3>
            <p className="mt-3 text-lg leading-relaxed text-white">{t('description')}</p>
          </div>

          {/* Right: Link Lists */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">
                {t('quickLinks')}
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-white hover:text-gray-200 transition-colors"
                  >
                    {t('home')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-white hover:text-gray-200 transition-colors"
                  >
                    {t('about')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-white hover:text-gray-200 transition-colors"
                  >
                    {t('contact')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">
                {t('legal')}
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-white hover:text-gray-200 transition-colors"
                  >
                    {t('privacyPolicy')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-white hover:text-gray-200 transition-colors"
                  >
                    {t('termsOfService')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Social Icons + Brand */}
      <div className="mt-8 px-4 py-2 flex flex-col gap-4 border-t border-white/20 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Social Icons */}
        <div className="flex items-center gap-4 text-sm">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-primary hover:bg-primary/10 hover:text-gray-200 transition-colors"
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-primary hover:bg-primary/10 hover:text-gray-200 transition-colors"
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-primary hover:bg-primary/10 hover:text-gray-200 transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
        </div>

        {/* Right: Brand Mark */}
        <div className="text-center sm:text-right">
          <p className="text-sm font-medium text-white">SaveOnBaby</p>
          <p className="text-xs text-white">
            © {new Date().getFullYear()} {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}

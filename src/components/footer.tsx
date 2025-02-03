import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="w-full border-t bg-accent">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-primary-foreground">MejorPrecio</h3>
            <p className="mt-2 text-sm text-primary-light">{t('description')}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-foreground">{t('quickLinks')}</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-primary-light hover:text-white transition-colors"
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-primary-light hover:text-white transition-colors"
                >
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-primary-light hover:text-white transition-colors"
                >
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-foreground">{t('legal')}</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-primary-light hover:text-white transition-colors"
                >
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-primary-light hover:text-white transition-colors"
                >
                  {t('termsOfService')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-foreground">{t('connect')}</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-light hover:text-white transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-light hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-light hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-light/20 pt-8 text-center">
          <p className="text-sm text-primary-light">
            © {new Date().getFullYear()} MejorPrecio. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}

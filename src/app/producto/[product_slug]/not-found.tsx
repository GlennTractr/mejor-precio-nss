import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations();
  return (
    <div className="px-4 py-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{t('product.notFound')}</h2>
        <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
          {t('actions.goHome')}
        </Link>
      </div>
    </div>
  );
}

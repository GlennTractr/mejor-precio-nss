'use client';

import { GoogleAnalytics } from '@next/third-parties/google';

interface GoogleAnalyticsProps {
  gaId: string;
}

export function GoogleAnalyticsScript({ gaId }: GoogleAnalyticsProps) {
  console.log('gaId', gaId);
  if (!gaId) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} debugMode={true} />;
}

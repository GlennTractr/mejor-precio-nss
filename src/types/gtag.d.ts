/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        currency?: string;
        value?: number;
        search_term?: string;
        item_list_id?: string;
        item_list_name?: string;
        items?: Array<{
          item_id: string;
          item_name: string;
          item_category?: string;
          item_brand?: string;
          price?: number;
          quantity?: number;
          affiliation?: string; // Shop name
        }>;
        [key: string]: any;
      }
    ) => void;
  }
}

export {};

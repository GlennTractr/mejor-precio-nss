import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '!./node_modules',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          50: '#fef9f7',
          100: '#fef2ee',
          200: '#fce4db',
          300: '#f9d5c7',
          400: '#f6bdb1',
          500: '#f1a394',
          600: '#e88373',
          700: '#dc5f4c',
          800: '#c44832',
          900: '#9d3a28',
          DEFAULT: '#f6bdb1',
          light: '#f9d5c7',
          dark: '#e88373',
          foreground: '#ffffff',
        },
        secondary: {
          50: '#f6faf9',
          100: '#edf4f2',
          200: '#dae9e5',
          300: '#c7ded8',
          400: '#b8dad2',
          500: '#a0c9bd',
          600: '#82b5a4',
          700: '#649e89',
          800: '#507e6d',
          900: '#3f6155',
          DEFAULT: '#b8dad2',
          hover: '#a0c9bd',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f6faf9',
          foreground: '#507e6d',
        },
        accent: {
          DEFAULT: '#649e89',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: '#dae9e5',
        input: '#edf4f2',
        ring: '#f6bdb1',
        layout: {
          background: '#f6faf9',
          header: '#f6bdb1',
          footer: '#649e89',
        },
        pricing: {
          regular: '#649e89',
          sale: '#f1a394',
          badge: {
            bg: '#f9d5c7',
            text: '#507e6d',
          },
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
};
export default config;

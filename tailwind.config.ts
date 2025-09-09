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
      fontFamily: {
        mulish: ['var(--font-mulish)', 'sans-serif'],
        quicksand: ['var(--font-quicksand)', 'sans-serif'],
        sans: ['var(--font-mulish)', 'sans-serif'],
      },
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
          DEFAULT: '#F7BCAF',
          light: '#f9d5c7',
          dark: '#e88373',
          foreground: '#ffffff',
        },
        secondary: {
          50: '#f1f4f5',
          100: '#e3e9ea',
          200: '#c7d2d5',
          300: '#a5b8bc',
          400: '#7a959c',
          500: '#5e7a82',
          600: '#4d646b',
          700: '#435559',
          800: '#3c4a4d',
          900: '#24444c',
          DEFAULT: '#1F4549',
          light: '#B6D9D0',
          hover: '#1e3a41',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f1f4f5',
          foreground: '#435559',
        },
        accent: {
          DEFAULT: '#5e7a82',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: '#c7d2d5',
        input: '#e3e9ea',
        ring: '#f6bdb1',
        layout: {
          background: '#ffffff',
          header: '#f6bdb1',
          footer: '#24444c',
        },
        pricing: {
          regular: '#24444c',
          sale: '#f1a394',
          badge: {
            bg: '#f9d5c7',
            text: '#24444c',
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

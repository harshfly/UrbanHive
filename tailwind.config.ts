import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-canvas': '#F5F5F7',
        'bg-surface': '#FFFFFF',
        'bg-surface-alt': '#E8E8ED',
        'border-subtle': '#E5E5EA',
        'border-strong': '#D2D2D7',
        'text-primary': '#1D1D1F',
        'text-secondary': '#86868B',
        'text-tertiary': '#AEAEB2',
        'accent-primary': '#0071E3',
        'accent-primary-soft': '#E5F1FF',
        'accent-amber': '#FF9500',
        'accent-amber-soft': '#FFF2E0',
        'accent-red': '#FF3B30',
        'accent-red-soft': '#FFE5E5',
        'accent-blue': '#0071E3',
        'accent-blue-soft': '#E5F1FF',
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'Inter', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'Inter', 'sans-serif'],
        mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        lg: '0 20px 40px -10px rgba(0, 0, 0, 0.12), 0 4px 16px -4px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '3xl': '24px',
        '2xl': '20px',
        xl: '16px', // for cards
        lg: '10px',  // for buttons and inputs
        full: '999px', // for pills/badges
      }
    },
  },
  plugins: [],
} satisfies Config

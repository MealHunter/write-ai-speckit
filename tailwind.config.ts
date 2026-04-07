import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: 'rgb(55, 65, 81)',
            a: {
              color: 'rgb(37, 99, 235)',
              '&:hover': {
                color: 'rgb(29, 78, 216)',
              },
            },
            strong: {
              color: 'rgb(17, 24, 39)',
              fontWeight: '600',
            },
            code: {
              color: 'rgb(17, 24, 39)',
              backgroundColor: 'rgb(243, 244, 246)',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            pre: {
              backgroundColor: 'rgb(17, 24, 39)',
              color: 'rgb(243, 244, 246)',
            },
            blockquote: {
              borderLeftColor: 'rgb(209, 213, 219)',
              color: 'rgb(75, 85, 99)',
            },
          },
        },
        invert: {
          css: {
            color: 'rgb(209, 213, 219)',
            a: {
              color: 'rgb(96, 165, 250)',
              '&:hover': {
                color: 'rgb(147, 197, 253)',
              },
            },
            strong: {
              color: 'rgb(243, 244, 246)',
            },
            code: {
              color: 'rgb(243, 244, 246)',
              backgroundColor: 'rgb(31, 41, 55)',
            },
            pre: {
              backgroundColor: 'rgb(3, 7, 18)',
            },
            blockquote: {
              borderLeftColor: 'rgb(75, 85, 99)',
              color: 'rgb(156, 163, 175)',
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
  darkMode: 'class',
};

export default config;

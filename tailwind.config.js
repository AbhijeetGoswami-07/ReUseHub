/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        // Core Visual Identity Palette
        brand: {
          primary: '#234B35',      // Forest Green
          secondary: '#3F7955',    // Primary / Secondary Green
          accent: '#A9BEA0',       // Sage Accent
          bg: '#F7F6EF',           // Soft Cream Background
          surface: '#FFFFFF',      // Surface White
          text: '#26332B',         // Dark text
          muted: '#788279',        // Muted grey-green
          border: '#E3E9E0',       // Subtle border
        },
        forest: {
          DEFAULT: '#234B35',
          50: '#F0F5F2',
          100: '#DCE8E0',
          200: '#BAD1C2',
          300: '#94B7A0',
          400: '#5F8F70',
          500: '#3F7955',
          600: '#2F6143',
          700: '#234B35',
          800: '#1B3B2A',
          900: '#142B1E',
          950: '#0C1C13',
        },
        sage: {
          DEFAULT: '#A9BEA0',
          50: '#F5F8F4',
          100: '#E9EFE7',
          200: '#D4E2D1',
          300: '#BED3B9',
          400: '#A9BEA0',
          500: '#8DA683',
          600: '#718A67',
          700: '#566B4E',
          800: '#3E4D38',
          900: '#283224',
        },
        cream: {
          DEFAULT: '#F7F6EF',
          50: '#FCFBF8',
          100: '#F7F6EF',
          200: '#ECE9D7',
          300: '#DFDAC0',
          400: '#CEC7A4',
          500: '#BAAF85',
        },
        dark: {
          DEFAULT: '#26332B',
          muted: '#788279',
          subtle: '#94A096',
          border: '#E3E9E0',
        },
        // The 5 Circular Action Color Tokens
        action: {
          reuse: '#2E7D32',
          repair: '#D97706',
          upcycle: '#7C3AED',
          donate: '#0284C7',
          recycle: '#0D9488',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-xs': '0 1px 3px 0 rgba(35, 75, 53, 0.04)',
        'soft-sm': '0 2px 8px -2px rgba(35, 75, 53, 0.06), 0 1px 4px -1px rgba(35, 75, 53, 0.04)',
        'soft-md': '0 6px 16px -4px rgba(35, 75, 53, 0.08), 0 2px 6px -2px rgba(35, 75, 53, 0.05)',
        'soft-lg': '0 12px 28px -6px rgba(35, 75, 53, 0.10), 0 4px 12px -2px rgba(35, 75, 53, 0.06)',
      }
    },
  },
  plugins: [],
}

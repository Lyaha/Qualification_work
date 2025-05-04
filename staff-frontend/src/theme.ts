import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

export const system = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: '#3CAD2D' },
        primaryHover: { value: '#59FA42' },
        primaryDark: { value: '#25691B' },
        error: { value: '#E53935' },
        success: { value: '#AEEA00' },
        background: { value: '#FFFFFF' },
        backgroundAlt: { value: '#F7F7F7' },
        textPrimary: { value: '#1A1A1A' },
        textSecondary: { value: '#555555' },
        border: { value: '#E0E0E0' },
      },
      fonts: {
        heading: { value: "'Poppins', sans-serif" },
        body: { value: "'Poppins', sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        'chakra-body-bg': { value: { default: 'background', _dark: 'gray.900' } },
        'chakra-body-text': { value: { default: 'textPrimary', _dark: 'whiteAlpha.900' } },
      },
    },
  },
});

const chakraTheme = createSystem(system, defaultConfig);

export default chakraTheme;

import { mswLoader } from 'msw-storybook-addon';

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  loaders: [mswLoader],
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'dark',
        value: '#1a1a1a', // Adjust the color to match your dark theme background
      },
      {
        name: 'light',
        value: '#d3d3d3',
      },
    ],
  },
};

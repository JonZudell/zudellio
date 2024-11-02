import { mswLoader } from 'msw-storybook-addon';

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  loaders: [mswLoader],
};

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import App from './App';

const meta: Meta = {
  title: 'App/Default',
  component: App,
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};
export default meta;


export const AppStory: StoryObj = {
  render: (args) => <App {...args} />,
};
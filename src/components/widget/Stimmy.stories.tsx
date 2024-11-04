import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Stimmy from './Stimmy';

const meta: Meta = {
  title: 'Components/Widget/Stimmy',
  component: Stimmy,
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

type Story = StoryObj<typeof Stimmy>;

export const StimmyStory: Story = {
  render: () => <Stimmy></Stimmy>,
};
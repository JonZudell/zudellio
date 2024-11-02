import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Button from './Button';

const meta: Meta = {
  title: 'App/Components/Button',
  component: Button,
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

type Story = StoryObj<typeof Button>;

export const DefaultButton: Story = {
  render: () => <Button className="bg-blue-500 text-white" text="primary"></Button>,
};
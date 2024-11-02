import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Button from './Button';
import TextInput from './TextInput';

const meta: Meta = {
  title: 'App/Components/TextInput',
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
  render: () => <TextInput label="text_input"></TextInput>,
};
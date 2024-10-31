import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Button from './Button';
import TextInput from './TextInput';

const meta: Meta = {
  title: 'Components/TextInput',
  component: Button,
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const DefaultButton: Story = {
  render: () => <TextInput label="default"></TextInput>,
};

export const PrimaryButton: Story = {
  render: () => <TextInput label="label"></TextInput>,
};
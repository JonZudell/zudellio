import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Button from './Button';
import TextArea from './TextArea';

const meta: Meta = {
  title: 'Components/TextArea',
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
  render: () => <TextArea label="default" rows={5}></TextArea>,
};

export const PrimaryButton: Story = {
  render: () => <TextArea label="label" rows={5}></TextArea>,
};
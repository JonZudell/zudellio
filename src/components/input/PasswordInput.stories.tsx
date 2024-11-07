import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import PasswordInput from './PasswordInput';

const meta = {
  component: PasswordInput,
} satisfies Meta<typeof PasswordInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    label: 'Password',
    value: '',
    setter: () => undefined,
    id: 'password-input',
    name: 'password',
  },
  render: (args) => <PasswordInput {...args} />,
};

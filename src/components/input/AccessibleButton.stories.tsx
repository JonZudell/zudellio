import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import AccessibleButton from './AccessibleButton';

const meta = {
  component: AccessibleButton,
} satisfies Meta<typeof AccessibleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    text: 'Example!',
    ariaLabel: 'Accessible Button!',
  },
  render: (args) => <AccessibleButton {...args} />,
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Rule30Conway from './Rule30Conway';

const meta = {
  component: Rule30Conway,
} satisfies Meta<typeof Rule30Conway>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: { width: 196, height: 100, cellSize: 32 },
  render: (args) => <Rule30Conway {...args} />,
};

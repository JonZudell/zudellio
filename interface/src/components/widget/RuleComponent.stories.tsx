import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import RuleComponent from './RuleComponent';
import { ThemeProvider } from '../../contexts/ThemeProvider';

const meta = {
  component: RuleComponent,
} satisfies Meta<typeof RuleComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ZeroTrue: Story = {
  args: {
    stateNumber: 0,
    value: true,
  },
  render: (args) => (
    <ThemeProvider>
      <RuleComponent {...args} />
    </ThemeProvider>
  ),
};

export const SevenFalse: Story = {
  args: {
    stateNumber: 7,
    value: false,
  },
  render: (args) => (
    <ThemeProvider>
      <RuleComponent {...args} />
    </ThemeProvider>
  ),
};

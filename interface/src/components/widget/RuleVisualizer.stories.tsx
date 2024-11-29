import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import RuleVisualizer from './RuleVisualizer';
import { ThemeProvider } from '../../contexts/ThemeProvider';

const meta = {
  component: RuleVisualizer,
} satisfies Meta<typeof RuleVisualizer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Rule1: Story = {
  args: {
    ruleNumber: 1,
  },
  render: (args) => (
    <ThemeProvider>
      <RuleVisualizer {...args} />
    </ThemeProvider>
  ),
};

export const Rule30: Story = {
  args: {
    ruleNumber: 30,
  },
  render: (args) => (
    <ThemeProvider>
      <RuleVisualizer {...args} />
    </ThemeProvider>
  ),
};

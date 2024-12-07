import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stimmy from './Stimmy';
import { ThemeProvider } from '../../contexts/ThemeProvider';

const meta = {
  component: Stimmy,
} satisfies Meta<typeof Stimmy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const StimmyStory: Story = {
  render: () => <Stimmy></Stimmy>,
};

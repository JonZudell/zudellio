import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Rule30Conway from './Rule30Conway';
import SignUpForm from '../form/SignUpForm';
import { StaticRouter } from 'react-router-dom/server';
import { ThemeProvider } from '../../contexts/ThemeProvider';

const meta = {
  component: Rule30Conway,
} satisfies Meta<typeof Rule30Conway>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: { width: 125, height: 125, cellSize: 32 },
  render: (args) => (
    <ThemeProvider>
      <Rule30Conway {...args} />
    </ThemeProvider>
  ),
};

export const Background: Story = {
  args: { width: 125, height: 125, cellSize: 32 },
  render: (args) => (
    <StaticRouter location={'/signup'}>
      <ThemeProvider>
        <Rule30Conway {...args} />
        <div style={{ position: 'relative' }}>
          <Rule30Conway {...args} style={{ position: 'absolute', zIndex: 0 }} />
          <SignUpForm style={{ position: 'relative', zIndex: 1 }} />
        </div>
      </ThemeProvider>
    </StaticRouter>
  ),
};

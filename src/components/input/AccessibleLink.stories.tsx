import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import AccessibleLink from './AccessibleLink';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  component: AccessibleLink,
} satisfies Meta<typeof AccessibleLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Example Link',
    href: '/',
    decorationLeft: '[',
    decorationRight: ']',
  },
  render: (args) => (
    <MemoryRouter>
      <AccessibleLink {...args} />
    </MemoryRouter>
  ),
};

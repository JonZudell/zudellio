import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SignUpForm from './SignUpForm';
import { StaticRouter } from 'react-router-dom/server';
const meta = {
  component: SignUpForm,
} satisfies Meta<typeof SignUpForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <StaticRouter location="/signup">
        <SignUpForm />
      </StaticRouter>
    );
  },
};

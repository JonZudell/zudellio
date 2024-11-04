import type { Meta, StoryObj } from '@storybook/react';
import SignInForm from './SignInForm';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
const meta = {
  component: SignInForm,
} satisfies Meta<typeof SignInForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>
    );
  },
};

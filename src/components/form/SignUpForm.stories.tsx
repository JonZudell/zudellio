import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SignUpForm from './SignUpForm';
import { MemoryRouter } from 'react-router-dom';
const meta = {
  component: SignUpForm,
} satisfies Meta<typeof SignUpForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>
    );
  },
};

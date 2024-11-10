import type { Meta, StoryObj } from '@storybook/react';
import SignInForm from './SignInForm';
import React from 'react';
import ContactForm from './ContactForm';
const meta = {
  component: ContactForm,
} satisfies Meta<typeof ContactForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <ContactForm />
    );
  },
};

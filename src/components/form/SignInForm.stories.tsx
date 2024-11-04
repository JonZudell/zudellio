import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import SignInForm from './SignInForm';
const meta = {
  component: SignInForm,
} satisfies Meta<typeof SignInForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
};

export const Success: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check if the form elements are hydrated and interactable
    const emailInput = canvas.getByLabelText('Email:');
    const passwordInput = canvas.getByLabelText('Password:');
    const submitButton = canvas.getByRole('button', { name: /sign in/i });

    // Simulate user interactions
    await userEvent.type(emailInput, 'success@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);
  },
};
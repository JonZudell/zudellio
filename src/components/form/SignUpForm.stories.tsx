import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import SignUpForm from './SignUpForm';
const meta = {
  component: SignUpForm,
} satisfies Meta<typeof SignUpForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check if the form elements are hydrated and interactable
    const emailInput = canvas.getByLabelText('Email:');
    const passwordInput = canvas.getByLabelText('Password:');
    const confirmPasswordInput = canvas.getByLabelText('Confirm Password:');
    const submitButton = canvas.getByRole('button', { name: /sign up/i });

    // Simulate user interactions
    await userEvent.type(emailInput, 'success@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    await userEvent.click(submitButton);

    // Check for expected outcomes
    await canvas.findByText(
      'Sign up successful. Please check your email to verify your account.',
    );
  },
};

export const PasswordsDontMatch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check if the form elements are hydrated and interactable
    const emailInput = canvas.getByLabelText('Email:');
    const passwordInput = canvas.getByLabelText('Password:');
    const confirmPasswordInput = canvas.getByLabelText('Confirm Password:');
    const submitButton = canvas.getByRole('button', { name: /sign up/i });

    // Simulate user interactions
    await userEvent.type(emailInput, 'failure@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'doenstmatch');
    await userEvent.click(submitButton);

    // Check for expected outcomes
    await canvas.findByText('Passwords do not match');
  },
};

import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import SignUpForm from './SignUpForm';

describe('SignUpForm', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('displays success message on successful sign up', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });

    render(<SignUpForm />);

    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText('Sign up successful. Please check your email to verify your account.')).toBeInTheDocument();
    });
  });

  test('displays error message on failed sign up', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

    render(<SignUpForm />);

    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText('Sign up failed. Please try again.')).toBeInTheDocument();
    });
  });

  test('renders sign-up form', () => {
    render(<SignUpForm />);
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  test('shows error message when passwords do not match', async () => {
    render(<SignUpForm />);
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test('shows success message on successful sign-up', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    render(<SignUpForm />);
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    expect(await screen.findByText(/sign up successful/i)).toBeInTheDocument();
  });

  test('shows error message on sign-up failure', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    render(<SignUpForm />);
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    expect(await screen.findByText(/sign up failed/i)).toBeInTheDocument();
  });

  test('shows error message on network error', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error'))) as jest.Mock;

    render(<SignUpForm />);
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    expect(await screen.findByText(/an error occurred/i)).toBeInTheDocument();
  });
});
import React, { useState } from 'react';
import PasswordInput from './PasswordInput';

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (agreeToTerms !== true) {
      setError('You must agree to the terms of service')
    }
    setError('');
    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        setSuccess('Sign up successful. Please check your email to verify your account.');
      } else {
        setError('Sign up failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold mb-4 text-center">Sign Up</h2> {/* 50% larger and 30% heavier */}
      {error && <p className="text-red-500 text-lg font-semibold text-sm">{error}</p>} {/* 50% larger and 30% heavier */}
      {success && <p className="text-green-500 text-lg font-semibold text-sm">{success}</p>} {/* 50% larger and 30% heavier */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-lg font-semibold text-gray-700">Email:</label> {/* 50% larger and 30% heavier */}
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          data-testid="email-input"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-lg font-semibold text-gray-700">Password:</label> {/* 50% larger and 30% heavier */}
        <PasswordInput id="password" name="password" value={password} setter={setPassword} />
      </div>
      <div className="mb-4">
        <label htmlFor="confirm-password" className="block text-lg font-semibold text-gray-700">Confirm Password:</label> {/* 50% larger and 30% heavier */}
        <PasswordInput id="confirm-password" name="confirm-password" value={confirmPassword} setter={setConfirmPassword} />
      </div>
      <div className="mb-4 flex justify-center">
        <label htmlFor="agreeToTerms" className="flex items-center text-lg font-semibold"> {/* 50% larger and 30% heavier */}
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="mr-2"
          />
          I agree to the <a href="/terms" className="pl-1 text-indigo-800 underline hover:text-indigo-600">terms of service</a>
        </label>
      </div>
      <button
        type="submit"
        data-testid="submit-button"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign Up
      </button>
      <div className="text-center text-gray-500 mt-4 text-lg">
        <p>
          Already have an account? <a href="/signin" className="text-indigo-800 underline hover:text-indigo-600">Sign In</a>
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;
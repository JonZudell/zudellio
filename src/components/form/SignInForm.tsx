import React, { useState } from 'react';

import {
  faFacebook,
  faGithub,
  faGoogle,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PasswordInput from '../input/PasswordInput';
import TextInput from '../input/TextInput';
import '../../main.css';

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch('/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ staySignedIn, email, password }),
      });
      if (response.ok) {
        setSuccess(
          'Sign in successful. Please check your email to verify your account.',
        );
      } else {
        setError('Sign in failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-extrabold mb-4 text-center">Sign In</h2>

      <div className="mb-4">
        {error && <p className="text-red-500 text-lg">{error}</p>}
        {success && <p className="text-green-500 text-lg">{success}</p>}
        <TextInput
          type="email"
          id="email"
          name="email"
          label="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          data-testid="email-input"
          tabIndex={1}
          className="mt-1 block focus:border-indigo-500 w-full"
          inputClassName="w-full"
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center">
          <a
            href="/forgot-password"
            className="text-lg text-indigo-800 underline hover:text-indigo-600"
          >
            Forgot Password?
          </a>
        </div>
        <PasswordInput
          id="password"
          name="password"
          value={password}
          setter={setPassword}
          className="w-full"
        />
      </div>
      <div className="mb-4 flex justify-center">
        <label
          htmlFor="staySignedIn"
          className="flex items-center text-lg font-semibold"
        >
          <input
            type="checkbox"
            id="staySignedIn"
            name="staySignedIn"
            checked={staySignedIn}
            onChange={(e) => setStaySignedIn(e.target.checked)}
            className="mr-2 text-lg"
          />
          Stay signed in
        </label>
      </div>
      <button
        type="submit"
        data-testid="submit-button"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign In
      </button>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-lg">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>
      <button
        type="button"
        aria-label="Sign in with Google"
        className="w-full my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => (window.location.href = '/auth/google')}
        disabled
      >
        <FontAwesomeIcon icon={faGoogle} className="mr-2" /> Sign in with Google
      </button>
      <button
        type="button"
        aria-label="Sign in with GitHub"
        className="w-full my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => (window.location.href = '/auth/github')}
        disabled
      >
        <FontAwesomeIcon icon={faGithub} className="mr-2" /> Sign in with GitHub
      </button>
      <button
        type="button"
        aria-label="Sign in with Facebook"
        className="w-full my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => (window.location.href = '/auth/facebook')}
        disabled
      >
        <FontAwesomeIcon icon={faFacebook} className="mr-2" /> Sign in with
        Facebook
      </button>

      <div className="text-center text-gray-500 mt-4 text-lg">
        <p>
          Don't have an account?{' '}
          <a
            href="/signup"
            className="text-indigo-800 underline hover:text-indigo-600"
          >
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;

import React, { useState } from 'react';
import PasswordInput from '../input/PasswordInput';
import TextInput from '../input/TextInput';
import '../../main.css';
import AccessibleButton from '../input/AccessibleButton';
import AccessibleLink from '../input/AccessibleLink';

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
      className="max-w-md mx-auto mt-8 border standard-shadow"
    >
      <div className="m-2em">
        <h2 className="text-3xl font-extrabold mb-4 text-center">Sign In</h2>
        <div className="mb-4">
          {error && <p className="text-red-500 text-lg">{error}</p>}
          {success && <p className="text-green-500 text-lg">{success}</p>}
          <TextInput
            type="email"
            id="email"
            name="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="email-input"
            className="mt-1 block focus:focused-border-color w-full"
            inputClassName="w-full"
          />
        </div>

        <div className="mb-4">
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
        <div className="flex flex-col items-center">
          <AccessibleButton
            text="sign_in"
            ariaLabel="Sign In"
            className="w-full m-1em p-2 text-xl"
            onClick={() => (window.location.href = '/auth/')}
            decorationLeft="< "
            decorationRight=" >"
          />
        </div>
        <div className="flex flex-column justify-center pt-4">
          <AccessibleLink
            href="/forgot-password"
            className="text-lg"
            text="forgot_password?"
            decorationLeft="["
            decorationRight="]"
          />
        </div>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-lg">
            <span className="px-2">or</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <AccessibleButton
            text="sign_in_with_google"
            ariaLabel="Sign in with Google"
            className="w-full text-gray-500 p-4"
            onClick={() => (window.location.href = '/auth/google')}
            decorationLeft="< "
            decorationRight=" >"
            disabled
          />
          <AccessibleButton
            text="sign_in_with_github"
            ariaLabel="Sign in with GitHub"
            className="w-full text-gray-500 p-4"
            onClick={() => (window.location.href = '/auth/github')}
            decorationLeft="< "
            decorationRight=" >"
            disabled
          />
          <AccessibleButton
            text="sign_in_with_facebook"
            ariaLabel="Sign in with Facebook"
            className="w-full text-gray-500 p-2"
            onClick={() => (window.location.href = '/auth/facebook')}
            decorationLeft="< "
            decorationRight=" >"
            disabled
          />
        </div>
        <div className="text-center mt-4 text-lg">
          <p>
            Don&apos;t have an account?{`\u0020`}
            <AccessibleLink
              href="/signup"
              text="sign_up"
              decorationLeft="["
              decorationRight="]"
            />
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;

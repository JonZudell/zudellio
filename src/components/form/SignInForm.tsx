import React, { useState } from 'react';
import PasswordInput from '../input/PasswordInput';
import TextInput from '../input/TextInput';
import '../../main.css';
import AccessibleButton from '../input/AccessibleButton';
import AccessibleLink from '../input/AccessibleLink';
import AccessibleCheckbox from '../input/AccessibleCheckbox';

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
      className="max-w-md mx-auto border standard-shadow text-lg"
    >
      <div className="m-1_5em">
        <h2 className="text-3xl font-extrabold mb-1em text-center">Sign In</h2>
        <div className="mb-1em">
          <div role="alert" aria-live="assertive">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </div>
          <TextInput
            type="email"
            id="email"
            name="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="email-input"
            className="block focus:focused-border-color w-full"
            inputClassName="w-full"
          />
        </div>
        <div className="mb-2em">
          <PasswordInput
            id="password"
            name="password"
            value={password}
            setter={setPassword}
            className="w-full"
            inputClassName="w-full"
          />
        </div>
        <div className="flex justify-center mb-1em ">
          <AccessibleCheckbox
            name="staySignedIn"
            onChange={(e: {
              target: {
                checked: boolean | ((prevState: boolean) => boolean);
              };
            }) => setStaySignedIn(e.target.checked)}
            checked={staySignedIn}
            ariaLabel={'staySignedIn'}
            inputId={'staySignedIn'}
          >
            Stay Signed in?
          </AccessibleCheckbox>
        </div>
        <div className="flex flex-col items-center mb-1em">
          <AccessibleButton
            text="sign_in"
            ariaLabel="Sign In"
            className="w-full m-1em"
            onClick={() => (window.location.href = '/auth/')}
          />
        </div>
        <div className="flex flex-column justify-center mb-1em">
          <AccessibleLink
            href="/forgot-password"
            text="forgot_password?"
            decorationLeft="["
            decorationRight="]"
          />
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2">or</span>
          </div>
        </div>
        <AccessibleButton
          text="sign_in_with_google"
          ariaLabel="Sign in with Google"
          className="w-full text-gray-500"
          onClick={() => (window.location.href = '/auth/google')}
          decorationLeft="< "
          decorationRight=" >"
          disabled
        />
        <AccessibleButton
          text="sign_in_with_github"
          ariaLabel="Sign in with GitHub"
          className="w-full text-gray-500"
          onClick={() => (window.location.href = '/auth/github')}
          decorationLeft="< "
          decorationRight=" >"
          disabled
        />
        <AccessibleButton
          text="sign_in_with_facebook"
          ariaLabel="Sign in with Facebook"
          className="w-full text-gray-500"
          onClick={() => (window.location.href = '/auth/facebook')}
          decorationLeft="< "
          decorationRight=" >"
          disabled
        />
        <div className="text-center">
          <p>
            Don&apos;t have an account?{`\u0020`}
            <AccessibleLink
              href="/auth/sign_up"
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

import React, { useState } from 'react';
import PasswordInput from '../input/PasswordInput';
import TextInput from '../input/TextInput';
import AccessibleLink from '../input/AccessibleLink'; // Import AccessibleLink component
import AccessibleCheckbox from '../input/AccessibleCheckbox'; // Import AccessibleCheckbox component
import AccessibleButton from '../input/AccessibleButton';

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
      setError('You must agree to the terms of service');
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
        setSuccess(
          'Sign up successful. Please check your email to verify your account.',
        );
      } else {
        setError('Sign up failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto border standard-shadow "
      >
        <div className="m-2em">
          <h2 className="text-3xl font-extrabold mb-2em text-center">
            Sign Up
          </h2>
          {error && (
            <p className="text-red-500 text-lg font-semibold mb-2em">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-lg font-semibold mb-2em">
              {success}
            </p>
          )}
          <TextInput
            type="email"
            id="email"
            name="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="email-input"
            className="block w-full focus:focused-border-color mb-2em"
            inputClassName="w-full"
          />
          <div className="mb-2em text-lg">
            <PasswordInput
              id="password"
              name="password"
              value={password}
              setter={setPassword}
            />
          </div>
          <div className="mb-2em text-lg">
            <PasswordInput
              id="confirm-password"
              name="confirm-password"
              label="Confirm Password"
              value={confirmPassword}
              setter={setConfirmPassword}
            />
          </div>
          <div className="flex justify-center">
            <label htmlFor="agreeToTerms" className="flex font-semibold">
              {' '}
              <AccessibleCheckbox
                inputId="agreeToTerms"
                name="agreeToTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                ariaLabel={'Agree to Terms'}
              >
                <span className="text-lg">
                  I agree to the{' '}
                  <span className="tooltip" title={'Terms of Service'}>
                    <AccessibleLink
                      href="/terms"
                      className="pl-1"
                      text="TOS"
                      decorationLeft="["
                      decorationRight="]"
                    />
                  </span>
                </span>
              </AccessibleCheckbox>
            </label>
          </div>
          <div className="flex flex-column justify-center">
            <AccessibleButton
              type="submit"
              data-testid="submit-button"
              text="sign_up"
              ariaLabel="Sign Up"
              className="w-full text-xl"
              decorationLeft="< "
              decorationRight=" >"
            />
          </div>
          <div className="text-center text-lg">
            <p>
              Already have an account?{' '}
              <AccessibleLink
                href="/signin"
                text="sign_in"
                decorationLeft="["
                decorationRight="]"
              />
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;

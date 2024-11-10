import React, { useState } from 'react';
import TextInput from '../input/TextInput';
import TextArea from '../input/TextArea';
import AccessibleButton from '../input/AccessibleButton';

const ContactForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
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
        body: JSON.stringify({ name, email, message }),
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
    <form action="/contact" method="post" onSubmit={handleSubmit}>
      <div className="flex justify-center py-1em">
        <p>Submit this form with a message.</p>
      </div>
      <div id="ssr-inject:form-feedback" role="alert" aria-live="assertive">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </div>
      <div className="flex justify-center items-center">
        <TextInput label="Email" className="w-64" inputClassName="w-full" />
        <span className="m-0_5em"></span>
        <TextInput label="Name" className="w-64" inputClassName="w-full" />
      </div>
      <div className="flex justify-center items-center py-2em">
        <TextArea
          inputId="contact-message"
          label="Message"
          className="w-full max-w-xl"
          inputClassName="w-full"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          rows={6}
        />
      </div>
      <div className="flex justify-center items-center">
        <AccessibleButton
          text={'send_message'}
          type="submit"
          ariaLabel={'Send Message Button'}
          disabled={false}
          className="w-36"
        />
      </div>
    </form>
  );
};

export default ContactForm;

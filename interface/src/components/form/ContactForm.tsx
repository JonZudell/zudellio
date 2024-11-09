import React from 'react';
import TextInput from '../input/TextInput';
import TextArea from '../input/TextArea';
import AccessibleButton from '../input/AccessibleButton';

const ContactForm: React.FC = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Message sent');
    // Add your form submission logic here
  };

  return (
    <form action="/contact" method="post" onSubmit={handleSubmit}>
      <div className="flex justify-center py-1em">
        <p>Submit this form with a message.</p>
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

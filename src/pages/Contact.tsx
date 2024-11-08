import React from 'react';
import ContactForm from '../components/form/ContactForm';
const Contact: React.FC = () => {
  return (
    <div className="w-full text-xl">
      <div className="flex justify-center items-center">
        <h2 className="">contact</h2>
      </div>
      <div className="flex justify-center py-1em">
        <p>Email me at jon@zudell.io</p>
      </div>
      <ContactForm />
    </div>
  );
};

export default Contact;

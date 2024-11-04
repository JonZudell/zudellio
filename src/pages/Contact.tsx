import React from 'react';
import AccessibleButton from '../components/input/AccessibleButton';
import TextArea from '../components/input/TextArea';
import TextInput from '../components/input/TextInput';
const Contact: React.FC = () => {
  return (
    <div className="w-full text-xl focus-within:z-20">
      <div className="flex justify-center items-center">
        <h2 className="">contact</h2>
      </div>
      <div className="flex justify-center py-1em">
        <p>Email me at jon@zudell.io</p>
      </div>
    </div>
  );
};

export default Contact;


import React from "react";
import TextInput from "../input/TextInput";
import TextArea from "../input/TextArea";
import AccessibleButton from "../input/AccessibleButton";

const ContactForm: React.FC = () => {
  return (
    <form>
      <div className="flex justify-center py-1em">
        <p>Submit this form with a message.</p>
      </div>
      <div className="flex justify-center items-center py-2em">
        <TextInput label="Email" className="w-96" inputClassName="w-full"/>
      </div>
      <div className="flex justify-center items-center py-2em">
        <TextArea label="Message" className="w-full" inputClassName="w-full" rows={6}/>
      </div>
      <div className="flex justify-center items-center">
        <AccessibleButton text={"send_message"} onClick={() => {}}decorationLeft="< " decorationRight=" >"/>
      </div>
    </form>
  );
};

export default ContactForm;
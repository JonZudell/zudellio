import React from "react";
import Button from "../components/Button";
import Content from "../components/Content";
import TextArea from "../components/TextArea";
import TextInput from "../components/TextInput";
import './index.css';
const Contact: React.FC = () => {
  return (
    <Content>
      <div className="w-full text-xl">
        <div className="flex justify-center items-center">
          <h2 className="">contact</h2>
        </div>
        <div className="flex justify-center py-1em">
          <p>Email me at jon@zudell.io</p>
        </div>
        <div className="flex justify-center py-1em">
          <p>- or -</p>
        </div>
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
          <Button text={"send_message"} decorationLeft="< " decorationRight=" >"/>
        </div>
      </div>
    </Content>
  );
};

export default Contact;
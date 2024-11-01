import React from "react";
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
        <div className="flex justify-center items-center">
          <TextInput label="Email" />
        </div>
        <div className="flex justify-center items-center">
          <TextArea label="Message" className="w-full" inputClassName="w-full" rows={6}/>
        </div>
      </div>
    </Content>
  );
};

export default Contact;
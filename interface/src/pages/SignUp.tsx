import React from 'react';
import SignUpForm from '../components/SignUpForm';
import Splash from '../components/Splash';

const SignUp: React.FC = () => {
  return (
    <Splash>
      <SignUpForm />
    </Splash>
  );
};

export default SignUp;
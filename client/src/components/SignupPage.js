import React from 'react';
import SignupForm from './SignupForm';
import {useHistory} from 'react-router-dom';
function SignupPage() {
  const handleSignup = (formData) => {
    
      console.log(formData); 
  
    
   fetch('/signup', {  
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
   },
   body: JSON.stringify(formData),
 })
   .then((response) => {
     if (response.ok) {
      history.push('/dashboard');
     } else {
     
       console.error('Failed to register the user');
     }
   });
};

const history = useHistory();
  return (
    <div>
     
      <SignupForm onSignup={handleSignup} />
    </div>
  );
}

export default SignupPage;

import React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // NOTE: JS library used to make HTTP requests from a browser; used here to fetch data (pins) from Atlas db

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  // Response/error from server
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    const userCredentials = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    // Make POST request to Atlas DB to verify user has an account to log in
    try {
      const loginRes = await axios.post('/login', userCredentials);

      console.log('* Login response from server: ', loginRes);
      setRes(`User has created an Adopter or Cat Profile: ${loginRes.data}.`);
      setErr(null);

      // If the user has not created an Adopter or Cat profile yet...
      if (!loginRes.data) {
        console.log('* User has not created an adopter or cat profile yet');
        // Navigate to the create Adopter or create Cat Profile page depending on the user's selection when they registered their account
        const userAccountType = await axios.post(
          '/login/getAccountType',
          userCredentials
        );
        console.log('* User account type: ', userAccountType.data);
        if (userAccountType.data === 'Adopter')
          navigate('/CreateAccountAdopter');
        else if (userAccountType.data === 'Cat') navigate('/create-account-cat');
      } else {
        console.log('* User already created an adopter or cat profile');
        const userAccountType = await axios.post(
          '/login/getAccountType',
          userCredentials
        );
        console.log('* User account type: ', userAccountType.data);
        if (userAccountType.data === 'Adopter') navigate('/CatsCardsPage');
        else if (userAccountType.data === 'Cat') navigate('/AdopterCardsPage');
      }
    } catch (err) {
      console.log('* Error from server: ', err.response.data);
      setRes(null);
      setErr(err.response.data);
    }
  };


  return (
    <div className='login-page'>
      <form className='login-form' onSubmit={handleSubmit}>
        <h3>Log In</h3>

        <input type='email' placeholder='email' ref={emailRef} />
        <input type='password' placeholder='password' ref={passwordRef} />

        <button type='submit'>Log in</button>
      </form>
      {res && <p className='response-text'>{JSON.stringify(res)}</p>}
      {err && <p className='error-text'>{err}</p>}
    </div>
  );
};

export default Login;

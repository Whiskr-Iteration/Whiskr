import React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // NOTE: JS library used to make HTTP requests from a browser; used here to fetch data (pins) from Atlas db

const Signup = ({googleUser}) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const profileTypeRef = useRef();


  console.log('googleUser in signup', googleUser);
  

  // Response/error from server
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    const newUser = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      profileType: profileTypeRef.current.value,
    };

    // Make POST request to Atlas DB to add new user
    try {
      const userResponse = await axios.post('/signup', newUser);

      console.log('* New user profile created, _id: ', userResponse.data);

      setRes(
        `User ID Created: ${userResponse.data}.  Please proceed to log in page.`
      );
      setErr(null);
    } catch (err) {
      console.log('* Error from server: ', err.response.data);
      setRes(null);
      setErr(err.response.data);
    }
  };

  return (
    <div className='signup-page'>
      <form className='signup-form' onSubmit={handleSubmit}>
        <h3>Sign up</h3>
        <input type='email' placeholder='email' ref={emailRef} defaultValue={googleUser ? googleUser.googleUser.email : ""} />
        <input type='password' placeholder='password' ref={passwordRef} defaultValue={googleUser ? googleUser.googleUser.password : ""}/>
        <select ref={profileTypeRef}>
          <option value='Adopter'>Adopt a cat</option>
          <option value='Cat'>Put a cat up for adoption</option>
        </select>

        <button>Register</button>
      </form>

      {res && <p className='response-text'>{JSON.stringify(res)}</p>}
      {err && <p className='error-text'>{err}</p>}
    </div>
  );
};

export default Signup;

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // NOTE: JS library used to make HTTP requests from a browser; used here to fetch data (pins) from Atlas db
import { GoogleLogin } from '@react-oauth/google';

const Login = ({setEmailPrefill}) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [googleIdToken, setGoogleIdToken] = useState(null);

  // Response/error from server
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (googleIdToken) {
      handleSubmit();
    }
  }, [googleIdToken])

  const handleSubmit = async e => {
    if (e) {
      e.preventDefault();
    }
    // Make POST request to Atlas DB to verify user has an account to log in
    try {
      let userResponse;
      if (googleIdToken) {
        const googleOauth = {
          googleIdToken
        }
        userResponse = await axios.post('/login', { googleOauth })
      } else {
        const userCredentials = {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        };
        userResponse = await axios.post('/login', userCredentials);
      }
      if (!userResponse) {
        navigate('/signup')
      }

      console.log('* Login response from server: ', userResponse);
      setRes(`User has created an Adopter or Cat Profile: ${userResponse.data.hasAdopterOrCatProfile}.`);
      setErr(null);

      if (userResponse.data.profileType === "Cat") {
        navigate('/CatsCardsPage');
      } else if (userResponse.data.profileType === "Adopter") {
        navigate('/AdopterCardsPage')
      }

    //   // If the user has not created an Adopter or Cat profile yet...
    //   if (!userResponse.data.hasAdopterOrCatProfile) {
    //     console.log('* User has not created an adopter or cat profile yet');
    //     // Navigate to the create Adopter or create Cat Profile page depending on the user's selection when they registered their account
    //     const userAccountType = await axios.post(
    //       '/login/getAccountType',
    //       userCredentials
    //     );
    //     setEmailPrefill(userResponse.data.userEmail);
    //     console.log('* User account type: ', userAccountType.data);
    //     if (userAccountType.data === 'Adopter')
    //       navigate('/CreateAccountAdopter');
    //     else if (userAccountType.data === 'Cat') navigate('/create-account-cat');
    //   } else {
    //     console.log('* User already created an adopter or cat profile');
    //     const userAccountType = await axios.post(
    //       '/login/getAccountType',
    //       userCredentials
    //     );
    //     console.log('* User account type: ', userAccountType.data);
    //     if (userAccountType.data === 'Adopter') navigate('/CatsCardsPage');
    //     else if (userAccountType.data === 'Cat') navigate('/AdopterCardsPage');
    //   }
    } catch (err) {
      console.log('* Error from server: ', err);
      if (err) {
        navigate('/signup');
      }
      setRes(null);
      setErr(err);
    }
  };


  return (
    <div className="signup-page">
      <div className="signup-form">
      <form onSubmit={handleSubmit}>
        <h3>Log In</h3>
        <label htmlFor="email">Username</label>
        <input id="email" type='email' placeholder='your@email.com' ref={emailRef} />
        <label htmlFor="password">Password</label>
        <input type='password' placeholder='password' ref={passwordRef} />

        <button type='submit'>Log in</button>
      </form>
        <p>Don't have an account? <Link to="/signup"><span >Sign up</span></Link></p>
        <div className="separator">
          <div className="line"></div>
          <p>or</p>
          <div className="line"></div>
        </div>
      {res && <p className='response-text'>{JSON.stringify(res)}</p>}
      {err && <p className='error-text'>{JSON.stringify(err)}</p>}
      <div className="googleOauthButton">
        <GoogleLogin
          onSuccess={credentialResponse => {
            const idToken = credentialResponse.credential;
            setGoogleIdToken(idToken);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </div>
    </div>
    </div>
  );
};

export default Login;

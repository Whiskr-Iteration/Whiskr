import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Home = ({setEmailPrefill, emailPrefill}) => {
  const navigate = useNavigate();
  const profileTypeRef = useRef();

  // setting the current googleIdToken accessed 
  // from google Oauth to be the ID Token
  const [googleIdToken, setGoogleIdToken] = useState(null);
  const [profileType, setProfileType] = useState(null);


  const handleProfile = async (e) => {
    e.preventDefault();
    await setProfileType(profileTypeRef.current.value);
  }

  useEffect(() => {
    // we are sending a post request to /login passing in the ID Token
    if (googleIdToken) {
      const googleOauth = {
        googleIdToken, 
        profileType
      }
      axios.post('/login', { googleOauth })
    .then(response => {
      console.log(response.data)
      const { hasAdopterOrCatProfile, profileType, userEmail } = response.data;
      setEmailPrefill(userEmail)
      if (hasAdopterOrCatProfile === undefined) {
        navigate('/signup');
      } else if (profileType === 'Cat' && hasAdopterOrCatProfile === false) {
        navigate('/create-account-cat');
      } else if (profileType === 'Cat' && hasAdopterOrCatProfile === true) {
        navigate('/CatsCardsPage')
      } else if (profileType === 'Adopter' && hasAdopterOrCatProfile === false) {
      navigate('/createAccountAdopter');
      } else if (profileType === 'Adopter' && hasAdopterOrCatProfile === true) {
        navigate('/AdopterCardsPage')
      }
    })
    .catch(error => {
      console.error(error, 'error in Home.js for google Oauth');
      // navigate('/signup');
    })
  } else {
    setGoogleIdToken(null);
  }
  }, [profileType])

  return (
    <>
      {googleIdToken ? (
        <form className="signup-form" onSubmit={handleProfile}>
          <h3>Are you looking to adopt or rehome your cat?</h3>
          <select ref={profileTypeRef}>
            <option value="Adopter">Adopt a cat</option>
            <option value="Cat">Put a cat up for adoption</option>
          </select>
          <button>Register</button>
        </form>
      ) : (
      <div className='slogan-signup-login-container'>
        <h1>Find the purrfect companion®</h1>

        <div className='signup-login-buttons'>
          <div>
            <Link to='/signup'>
              <button variant='contained'>Sign up</button>
            </Link>
          </div>
          <div>
            <Link to='/login'>
              <button variant='contained'>Log in</button>
            </Link>
          </div>
          <div className="googleOauthButton">
            <GoogleLogin
              onSuccess={credentialResponse => {
                const idToken = credentialResponse.credential;
                setGoogleIdToken(idToken)
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default Home;

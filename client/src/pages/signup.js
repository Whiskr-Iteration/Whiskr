import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';

const Signup = ({emailPrefill, setEmailPrefill}) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const profileTypeRef = useRef();

  // setting the current googleIdToken accessed 
  // from google Oauth to be the ID Token
  const [googleIdToken, setGoogleIdToken] = useState(null);
  const [profileType, setProfileType] = useState(null);

  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleProfile = (e) => {
    e.preventDefault();
    setProfileType(profileTypeRef.current.value);
  } 

  useEffect(() => {
    if (googleIdToken && profileType) {
      handleSubmit();
    }
  }, [googleIdToken, profileType])

  const handleSubmit = async (e) => {
    console.log(profileTypeRef)
    if (e) {
      e.preventDefault();
    }
    // Make POST request to Atlas DB to add a new user
    try {
      let userResponse;
      if (googleIdToken) {
        console.log('hi from googleIdToken')
        const googleOauth = {
          googleIdToken,
          profileType
        }
        console.log(profileType, 'profileType in try on signup')
        userResponse = await axios.post('/login', { googleOauth })
      } else {
        console.log('hi from e');
        const newUser = {
          email: emailRef.current.value,
          password: passwordRef.current.value,
          profileType: profileTypeRef.current.value,
        };
        userResponse = await axios.post("/login", newUser);
      }

      console.log("* New user profile created, _id: ", userResponse.data._id);
      console.log("profileTypeRef", profileTypeRef.current.value);

      setRes(
        `User ID Created: ${userResponse.data._id}.  Please proceed to the login page.`
      );

      if (userResponse.data.hasAdopterOrCatProfile) {
        console.log('ALREADY HAVE A PROFILE')
        navigate('/login');
      }
      setEmailPrefill(userResponse.data.userEmail);
      console.log(userResponse, 'userResponse');
      if (userResponse.data.profileType === 'Cat' && userResponse.data.hasAdopterOrCatProfile === false) {
        navigate('/create-account-cat');
      } else if (userResponse.data.profileType === 'Adopter' && userResponse.data.hasAdopterOrCatProfile === false) {
        navigate('/createAccountAdopter');
      }

    } catch (error) {
      console.log("* Error from the server: ", error.response?.data || "Unknown Error Post");
      setErr(error.response?.data || "Unknown Error Post");
    }
  };

  return (
    <>
      {googleIdToken ? (
        <form className="signup-form" onSubmit={handleProfile}>
          <select ref={profileTypeRef}>
            <option value="Adopter">Adopt a cat</option>
            <option value="Cat">Put a cat up for adoption</option>
          </select>

          <button>Register</button>
        </form>
      ) : (
      <div className="signup-page">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h3>Sign up</h3>
          <input
            type="email"
            placeholder="email"
            ref={emailRef}
          />
          <input
            type="password"
            placeholder="password"
            ref={passwordRef}
          />
          <select ref={profileTypeRef}>
            <option value="Adopter">Adopt a cat</option>
            <option value="Cat">Put a cat up for adoption</option>
          </select>

          <button>Register</button>
        </form>

      {res && <p className="response-text">{JSON.stringify(res)}</p>}
      {err && <p className="error-text">{err}</p>}
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
      )}
    </>
  );
};

export default Signup;



import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';
import cat from '../../assets/cat-2.png';

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
    <div className="signup-page">
      <div className="signup-form">
      {googleIdToken ? (
        <form onSubmit={handleProfile}>
          <h3 class="google-oauth-h3"><img src={cat} />Just one more step!</h3>
          <label>Are you looking to rehome or adopt?</label>
          <select ref={profileTypeRef}>
            <option value="Adopter">Adopt a cat</option>
            <option value="Cat">Put a cat up for adoption</option>
          </select>

          <button class="google-oauth-button">SIGN UP</button>
        </form>
      ) : (
      <div>
        <form onSubmit={handleSubmit}>
          <h3>Where cat lovers unite</h3>
          <label htmlFor="email">Username</label>
          <input
            id="email"
            placeholder="your@email.com"
            type="email"
            ref={emailRef}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="must be 8 characters"
            ref={passwordRef}
          />
          <label htmlFor="adoptOrCat">Are you looking to adopt or rehome a cat?</label>
              <div className="select-profile-type">
                  <select ref={profileTypeRef}>
                    <option value="Adopter">Adopt a cat</option>
                    <option value="Cat">Put a cat up for adoption</option>
                  </select>
              </div>
          <button>SIGN UP</button>
        </form>
        <p>Already have an account? <Link to="/login"><span >Login</span></Link></p>
        <div className="separator">
          <div className="line"></div>
          <p>or</p>
          <div className="line"></div>
        </div>

      <div className="googleOauthButton">
        <GoogleLogin
          onSuccess={credentialResponse => {
            const idToken = credentialResponse.credential;
            setGoogleIdToken(idToken);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
          buttonText="Sign in with Google"
          isSignedIn={false}
        />

        {res && <p className="response-text">{JSON.stringify(res)}</p>}
        {err && <p className="error-text">{err}</p>}
        </div>
        </div>
      
      )}
      </div>
    </div>
  );
};

export default Signup;



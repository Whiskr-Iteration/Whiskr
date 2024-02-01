import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = ({emailPrefill, setEmailPrefill}) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const profileTypeRef = useRef();

  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      profileType: profileTypeRef.current.value,
    };

    // Make POST request to Atlas DB to add a new user
    try {
      const userResponse = await axios.post("/signup", newUser);

      console.log("* New user profile created, _id: ", userResponse.data.id);
      console.log("profileTypeRef", profileTypeRef.current.value);

      setRes(
        `User ID Created: ${userResponse.data}.  Please proceed to the login page.`
      );
      setEmailPrefill(newUser.email)
      if (newUser.profileType === 'Cat') {
        navigate('/create-account-cat');
      } else if (newUser.profileType === 'Adopter') {
        navigate('/createAccountAdopter');
      }

    } catch (error) {
      console.log("* Error from the server: ", error.response?.data || "Unknown Error Post");
      setErr(error.response?.data || "Unknown Error Post");
    }
  };

  useEffect(() => {
    if (res) {
      navigate("/login");
    }
  }, [res, navigate]);

  return (
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
    </div>
  );
};

export default Signup;




// import React from "react";
// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios"; // NOTE: JS library used to make HTTP requests from a browser; used here to fetch data (pins) from Atlas db

// const Signup = (googleUser) => {
//   const emailRef = useRef();
//   const passwordRef = useRef();
//   const profileTypeRef = useRef();
//   // const [googleCredentials, setGoogleCredentials] = useState(null);

//   const [googleEmail, setGoogleEmail] = useState(null);
//   const [googlePassword, setGooglePassword] = useState(null);
//   // Response/error from server
//   const [res, setRes] = useState(null);
//   const [err, setErr] = useState(null);
  


// useEffect(() => {
//   if (googleUser) {
//     setGoogleEmail(googleUser.googleUser.email);
//     setGooglePassword(googleUser.googleUser.password);
//   } 
// }, [googleUser]);

//   useEffect(() => {
//     if (res) {
//       // Reset values when the form is submitted
//       setGoogleEmail(null);
//       setGooglePassword(null);
//     }
//   }, [res]);


//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newUser = {
//       email: emailRef.current.value,
//       password: passwordRef.current.value,
//       profileType: profileTypeRef.current.value,
//     };

//     // Make POST request to Atlas DB to add new user
//     try {
//       const userResponse = await axios.post("/signup", newUser);

//       console.log("* New user profile created, _id: ", userResponse.data.id);
//       console.log(
//         "* New user profile created, _id: ",
//         typeof userResponse.data.id
//       );
//       console.log("profileTypeRef", profileTypeRef.current.value);

//       setRes(
//         `User ID Created: ${userResponse.data}.  Please proceed to log in page.`
//       );
//       setIsFormSubmitted(true);
//       // setErr(null);
//       // navigate("/login");
//     } catch (err) {
//       console.log("* Error from server: ", err.response.data);
//       if(error.response && error.response.data) {
//       // setRes(null);
//       setErr(err.response.data);
//     } else {
//       setErr("Unknown Errror Post")
//       }
//     }
//   };

//     useEffect(() => {
//       if (res) {
//         navigate("/login");
//       }
//     }, [res, navigate])
//   return (
//     <div className="signup-page">
//       <form className="signup-form" onSubmit={handleSubmit}>
//         <h3>Sign up</h3>
//         <input
//           type="email"
//           placeholder="email"
//           ref={emailRef}
//           defaultValue={googleEmail ? googleEmail: ""}
//         />
//         <input
//           type="password"
//           placeholder="password"
//           ref={passwordRef}
//           defaultValue={googlePassword ? googlePassword : ""}
//         />
//         <select ref={profileTypeRef}>
//           <option value="Adopter">Adopt a cat</option>
//           <option value="Cat">Put a cat up for adoption</option>
//         </select>

//         <button>Register</button>
//       </form>

//       {res && <p className="response-text">{JSON.stringify(res)}</p>}
//       {err && <p className="error-text">{err}</p>}
//     </div>
//   );
// };

// export default Signup;

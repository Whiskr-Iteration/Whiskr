import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
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
        </div>
      </div>
    </>
  );
};

export default Home;

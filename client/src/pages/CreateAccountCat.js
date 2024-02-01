import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccountCat = ({ setEmailPrefill, emailPrefill }) => {
  const emailRef = useRef();
  const catNameRef = useRef();
  const catBreedRef = useRef();
  const catAgeRef = useRef();
  const aboutMeRef = useRef();
  const profilePicRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    const newCat = {
      email: emailRef.current.value,
      name: catNameRef.current.value,
      breed: catBreedRef.current.value,
      age: catAgeRef.current.value,
      aboutMe: aboutMeRef.current.value,
      imageUrl: 'https://i.imgur.com/7F5mhPp.gif',
    };
    setEmailPrefill(null);
    try {
      const catResponse = await axios.post('/login/createCatProfile', newCat);

      if (catResponse) {
        console.log('* New cat profile created, _id: ', catResponse.data);
        navigate('/AdopterCardsPage');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className='create-profile-page' onSubmit={handleSubmit}>
      <h3>Create a profile for your cat!</h3>
      <label>Email:</label>
      <input type='email' placeholder='Email' ref={emailRef} defaultValue={emailPrefill ? emailPrefill : ''}/>
      <label>Name:</label>
      <input type='name' placeholder='Kitty name' ref={catNameRef} />
      <label>Type of cat:</label>
      <select name='age' id='age' ref={catBreedRef}>
        <option value='Calico'>Calico</option>
        <option value='Tabby'>Tabby</option>
        <option value='Siamese'>Siamese</option>
        <option value='Shorthair'>Shorthair</option>
        <option value='Persian'>Persian</option>
        <option value='Burmese'>Burmese</option>
      </select>
      <label>Age of cat:</label>
      <select name='age' id='age' ref={catAgeRef}>
        <option value='1'>1 Year</option>
        <option value='2'>2 Years</option>
        <option value='3'>3 Years</option>
        <option value='4'>4 Years</option>
        <option value='5+'>5+ Years</option>
      </select>
      <label>About your cat:</label>
      <input type='about me' placeholder='about me' ref={aboutMeRef} />
      <label>Picture of your cat:</label>
      <input type='file' placeholder='Add images here' ref={profilePicRef} />
      <button>Create Profile</button>
    </form>
  );
};

export default CreateAccountCat;

// Pet ID
// 50881400
// Pet type
// Cat
// Sex
// Male
// Age
// 6 years old, Adult
// Breed
// Domestic Short Hair - Mixed breed
// Size
// Small, 15.44 pounds
// Location
// Foster

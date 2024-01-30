import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccountAdopter = (googleUser) => {
  const emailRef = useRef();
  const nameRef = useRef();
  const aboutMeRef = useRef();
  // const imageUrl = useRef();
  const professionRef = useRef();
  const experienceRef = useRef();
  const navigate = useNavigate();
  const googleUserEmail = googleUser.googleUser.userEmail;

  const handleSubmit = async e => {
    e.preventDefault();

    const newAdopter = {
      email: emailRef.current.value,
      name: nameRef.current.value,
      aboutMe: aboutMeRef.current.value,
      // profilePic: profilePicRef.current.value,
      imageUrl: 'https://i.imgur.com/OckVkRo.jpeg',
      profession: professionRef.current.value,
      experience: experienceRef.current.value,
    };

    console.log('* Profile to be added to db: ', newAdopter);

    try {
      const adopterResponse = await axios.post(
        '/login/createAdopterProfile',
        newAdopter
      );

      if (adopterResponse) {
        console.log(
          '* New adopter profile created, _id: ',
          adopterResponse.data
        );
        navigate('/CatsCardsPage');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form className='create-profile-page' onSubmit={handleSubmit}>
        <h3>Create your adopter profile!</h3>
        <label>Email: </label>
        <input type='email' placeholder='email' ref={emailRef} defaultValue={googleUserEmail ? googleUserEmail : ""} />
        <label>Name: </label>
        <input type='text' placeholder='full name' ref={nameRef} />
        <label>About Me: </label>
        <input type='about me' placeholder='about me' ref={aboutMeRef} />
        {/* <label>Add images here: </label>
        <input type='file' placeholder='image url' ref={profilePicRef} /> */}
        <label>Profession: </label>
        <input type='profession' placeholder='profession' ref={professionRef} />
        <label>Experience w/ Cats: </label>
        <select name='age' id='age' ref={experienceRef}>
          <option value='1'>0-6 months</option>
          <option value='2'>1-2 Years</option>
          <option value='3'>2-5 Years</option>
          <option value='4'>5+ Years</option>
        </select>
        {/* <Link to='/AdopterCardsPage'> */}
        <button>Create Profile</button>
        {/* </Link> */}
      </form>
    </div>
  );
};

export default CreateAccountAdopter;

// //How would you describe your cat experience?
// If applicable, please list any pets that currently live in your home:
// What age range are you looking to adopt? (check all that apply)

// A kitten under 6 months

// An adolescent cat, 6 months to about a year

// Adult [1 year to 8 years old]

// Senior [8 years old and up]
// What type of cat do you think would most enjoy your household? (check all that apply)

// A confident, out-going cat who enjoys a lot of household activity

// A shy cat who enjoys a quiet environment

// A cat who enjoys living with a cat(s)

// A cat who enjoys living with a dog(s)

// A cat who might enjoy being around children
// What type of cat best matches what you are looking for? (check all that apply)

// A cat who is active and I can play with a few times a day

// A more independent cat who will do their own thing

// A cat who enjoys lying next to me on the couch and being petted

// A shy cat who may require some patience on my part to help them become comfortable in my home

// A cat who has been at the shelter for a longer time than most
// There are many tips we can offer to help you become a happy cat owner. What would you be interested in learning more about?

// The first two weeks: How to set my cat up for success

// How to play with my cat

// How to keep my cat from play biting or scratching me

// How to introduce a new cat to my current cat(s)

// Scratching furniture

// Using the litterbox

// What and how often to feed my cat

// Grooming Instructions
// What else is important for us to know about you and/or the type of cat you’re looking for? (Required)
// What drew you to this specific cat? (Required)
// To help us make the best match possible, please let us know who else lives in your home and your relation to them? If applicable, please include age of children in your home* (Required)
// How did you hear about the ASPCA?
// Many pets at the ASPCA Adoption Center have medical and/or behavioral needs and require a certain type of home, which is detailed in the pet’s bio. If you have not yet read this pet’s bio, please hit the back button and read the bio before continuing.

// I acknowledge I have read this pet’s bio.

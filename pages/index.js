// Import necessary modules and components
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';
import { UnsplashImage } from '../components/UnsplashImage';
import { Loader } from '../components/Loader';
import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

// Styled-components Global Style
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
    background-color: ${(props) => (props.darkMode ? '#222' : '#fff')};
    color: ${(props) => (props.darkMode ? '#fff' : '#222')};
  }
`;

// Styled-components WrapperImages
const WrapperImages = styled.section`
  max-width: 75rem;
  height: auto;
  margin: 6rem auto;
  display: grid;
  grid-gap: 2em;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: 450px;
`;

// Constants for caching data
const CACHE_KEY = 'unsplashImages';
const CACHE_EXPIRATION = 2400;

// Home component
const Home = () => {
  // State variables
  const [images, setImages] = useState([]); // to store images fetched from the API
  const [likedImages, setLikedImages] = useState([]); // to store liked images
  const [darkMode, setDarkMode] = useState(false); // to track the dark mode state

  // Fetch images on initial load
  useEffect(() => {
    // Check if cached data exists and is not expired
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION * 1000) {
      setImages(cachedData.images); // Use cached data if valid
    } else {
      fetchImages(); // Otherwise, fetch new images
    }
  }, []);

  // Fetch images from Unsplash API
  const fetchImages = (count = 10) => {
    const apiRoot = 'https://api.unsplash.com';
    const accessKey = process.env.REACT_APP_ACCESSKEY;

    axios
      .get(`${apiRoot}/photos/random?client_id=yMx72xpmPgx00U6YSBrDPtELZ9KJV48ZIm_zqck7Hb4&count=${count}`)
      .then((res) => {
        const newImages = res.data.map((image) => ({
          ...image,
          comments: [],
        }));
        setImages((prevImages) => [...prevImages, ...newImages]);

        // Cache the new data in localStorage
        const cacheData = {
          timestamp: Date.now(),
          images: [...images, ...newImages],
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Scroll event listener for infinite scrolling (not implemented yet)
  useEffect(() => {
    const handleScroll = () => {
      // Add your infinite scrolling logic here
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to handle like/unlike on an image
  const handleLike = (imageId) => {
    setImages((prevImages) =>
      prevImages.map((image) =>
        image.id === imageId ? { ...image, likes: image.likes + 1 } : image
      )
    );

    if (likedImages.includes(imageId)) {
      setLikedImages((prevLikedImages) => prevLikedImages.filter((id) => id !== imageId));
      setImages((prevImages) =>
        prevImages.map((image) =>
          image.id === imageId ? { ...image, likes: image.likes - 2 } : image
        )
      );
    } else {
      setLikedImages((prevLikedImages) => [...prevLikedImages, imageId]);
    }
  };

  // Function to toggle dark mode
  const handleDarkModeToggle = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  console.log(images); // Log images to the console

  // JSX rendering of the component
  return (
    <>
      <div>
        {/* Header */}
        <div className={styles.nav1}>
          <h1>FEEDS</h1>
          <h6>Infinite Scrolling Application using Unsplash API</h6>
        </div>

        {/* Dark mode toggle button */}
        <button onClick={handleDarkModeToggle}>Toggle Dark mode</button>

        {/* Global style for dark mode */}
        <GlobalStyle darkMode={darkMode} />

        {/* Infinite scroll component */}
        <InfiniteScroll dataLength={images.length} next={fetchImages} hasMore={true} loader={<Loader />}>
          <div className={styles.wrapper} style={{ background: darkMode ? '#333' : 'white' }}>
            {images.map((image) => (
              <div className={styles.imgsec} key={image.id}>
                {/* Image details */}
                <div style={{ padding: '1vw', borderRadius: '5px' }}>
                  User:{' '}
                  <Link href={`/profileHader?username=${image.user.username}`}>
                    <b>@{image.user.username}</b>
                  </Link>
                  <p>
                    <i>Location: {image.location.country}</i>
                  </p>

                  {/* Display the UnsplashImage component */}
                  <UnsplashImage url={image.urls.thumb} style={{ height: '200px' }} />

                  {/* Links to different image sizes */}
                  <div style={{ display: 'inline-flex', justifyContent: 'space-evenly', position: 'relative' }}>
                    <Link href={image.urls.raw} style={{ margin: '.2vw' }}>
                      Raw
                    </Link>
                    <Link href={image.urls.full} style={{ margin: '.2vw' }}>
                      Full
                    </Link>
                    <Link href={image.urls.regular} style={{ margin: '.2vw' }}>
                      Regular
                    </Link>
                  </div>

                  {/* Like button */}
                  <div style={{ borderRadius: '2px' }}>
                    <div className={styles.like}>
                      <button onClick={() => handleLike(image.id)}>
                        {likedImages.includes(image.id) ? <AiFillHeart size={22} color="red" /> : <AiOutlineHeart size={22} color="black" />}
                      </button>
                      <p>Likes: {image.likes}</p>
                    </div>
                  </div>

                  {/* Image description */}
                  <h>
                    <b>About:</b> {image.alt_description}
                  </h>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default Home;

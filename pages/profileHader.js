import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import { UnsplashImage } from '../components/UnsplashImage';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';

const ProfileHader = () => {
  // State variables
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list' for image view
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const [userDetails, setUserDetails] = useState(null); // State to store user details

  // Get the "username" parameter from the router query
  const router = useRouter();
  const { username } = router.query;

  // Fetch user details from Unsplash API
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const apiRoot = 'https://api.unsplash.com';
        const accessKey = process.env.REACT_APP_ACCESSKEY;

        const response = await axios.get(
          `${apiRoot}/users/${username}?client_id=yMx72xpmPgx00U6YSBrDPtELZ9KJV48ZIm_zqck7Hb4`
        );

        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (username) {
      fetchUserDetails();
    }
  }, [username]);

  // Function to toggle between grid and list view
  const toggleView = () => {
    setViewType((prevType) => (prevType === 'grid' ? 'list' : 'grid'));
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  // If user details are not loaded yet, show a loading message
  if (!userDetails) {
    return <div>Loading...</div>;
  }

  // JSX rendering of the component
  return (
    <div className={darkMode ? styles.darkMode : styles.lightMode}>
      {/* Header */}
      <div className={styles.nav1}>
        <h1>User Profile</h1>
        <h6>Infinite Scrolling Application using Unsplash API</h6>
      </div>
      {/* Dark mode toggle button */}
      <button onClick={toggleDarkMode} style={{ marginLeft: '1rem', position: 'absolute' }}>
        Toggle Dark Mode
      </button>
      {/* User profile information */}
      <div className={styles.proinfo}>
        <div className={styles.dp}>
          <img
            src={userDetails.profile_image.large}
            alt={<FaUser />}
            style={{ borderRadius: '80px' }}
          />
        </div>
        <div className={styles.info1}>
          <h3>
            {userDetails.first_name} {userDetails.last_name}
          </h3>
          <h5>@{userDetails.username}</h5>
          <h4>Bio: {userDetails.bio}</h4>
        </div>
      </div>
      {/* Follow stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.5vw 2vw 0.5vw 2vw',
          backgroundColor: 'grey',
        }}
      >
        <h4>
          Followers: <i>{userDetails.followers_count}</i>
        </h4>
        <h4>
          Followings: <i>{userDetails.following_count}</i>
        </h4>
      </div>
      <br />
      {/* Button to switch between grid and list view */}
      <button onClick={toggleView} style={{ height: '3vw', minHeight: '30px' }}>
        Switch to {viewType === 'grid' ? 'List' : 'Grid'} View
      </button>

      {/* Grid or List of user images */}
      <div className={viewType === 'grid' ? styles.gridContainer : styles.listContainer}>
        {userDetails.photos.map((image) => (
          <div key={image.id} className={viewType === 'grid' ? styles.gridItem : styles.listItem}>
            {/* Display the UnsplashImage component */}
            <UnsplashImage url={image.urls.thumb} />
            <p>
              Resolution: <a href={image.urls.full}>Full</a>{' '}
              <a href={image.urls.raw}>Raw</a> <a href={image.urls.regular}>Regular</a>
            </p>
            <p>Uploaded on: {image.created_at}</p>
            <p>{image.slug} </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileHader;

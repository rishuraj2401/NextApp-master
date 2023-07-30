// pages/api/images.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const apiRoot = 'https://api.unsplash.com';
    const accessKey = process.env.REACT_APP_ACCESSKEY;
    const count = 10;

    const response = await axios.get(`${apiRoot}/photos/random?client_id=${accessKey}&count=${count}`);
    const images = response.data.map((image) => ({
      ...image,
      comments: [],
    }));

    res.status(200).json(images);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching images' });
  }
}

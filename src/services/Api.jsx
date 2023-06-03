 import axios from 'axios';
// import axios from 'axios/dist/axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '34881387-b4ef6ac793e52587d6a65ce3b';
export const perPage = 12;

export const getImages = async (query, page) => {
  const response = await axios.get(
    `?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response.data;
};

export const normalizedImages = imagesArray =>
  imagesArray.map(({ id, tags, webformatURL, largeImageURL }) => {
    return { id, tags, webformatURL, largeImageURL };
  });
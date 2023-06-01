// export default async function getImages(inputValue, page = 1) {
//   const url = 'https://pixabay.com/api/';
//   const API_KEY = '34881387-b4ef6ac793e52587d6a65ce3b';

//   return await fetch(
//     `${url}?q=${inputValue}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
//   ).then(res => res.json());
// }
import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '34881387-b4ef6ac793e52587d6a65ce3b';

async function fetchApi(searchQuery, page=1) {
  const response = await axios.get(
    `?q=${searchQuery}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`
  );
  return response.data;
}
export default fetchApi;
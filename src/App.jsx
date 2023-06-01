import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import SearhBar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import LoadMoreButton from './Button/Button';
import { AppContainer } from './App.styled';
import fetchApi from './services/imgApi';
import Spiner from './Loader/Loader';
import Modal from './Modal/Modal';

axios.defaults.baseURL = 'https://pixabay.com/api/';
export default class App extends Component {
  static propTypes = { searchQuery: PropTypes.string };
  state = {
    searchQuery: '',
    images: [],
    page: 1,
    selectedImage: null,
    alt: null,
    status: 'idle',
    error: null,
  };
  totalHits = null;

  async componentDidUpdate(_, prevState) {
    const { page, searchQuery } = this.state;
    if (prevState.searchQuery !== searchQuery || prevState.page !== page) {
      this.setState({ status: 'pending' }); // Встановлюємо статус "pending" перед початком запиту

      try {
        const imageData = await fetchApi(searchQuery, page); // Виконуємо HTTP-запит з використанням функції fetchApi
        this.totalHits = imageData.total; // Зберігаємо загальну кількість зображень
        const imagesHits = imageData.hits; // Отримуємо масив зображень з відповіді
        if (!imagesHits.length) {
          alert(
            'No results were found for your search, please try something else.'
          ); // Якщо немає результатів, виводимо повідомлення
        }
        this.setState(({ images }) => ({
          images: [...images, ...imagesHits], // Додаємо нові зображення до поточного масиву зображень
          status: 'resolved', // Встановлюємо статус "resolved" після успішного завершення запиту
        }));

        if (page > 1) {
          const CARD_HEIGHT = 300;
          window.scrollBy({
            top: CARD_HEIGHT * 2,
            behavior: 'smooth',
          }); // Прокручуємо сторінку вниз, якщо ми завантажуємо наступну сторінку зображень
        }
      } catch (error) {
        alert('Sorry something went wrong.'); // Виводимо повідомлення про помилку, якщо виникла помилка при запиті
        this.setState({ status: 'rejected' }); // Встановлюємо статус "rejected" у разі невдалого запиту
      }
    }
  }

  handleFormSubmit = searchQuery => {
    if (this.state.searchQuery === searchQuery) {
      return; // Якщо вже виконується пошук з таким самим запитом, нічого не робимо
    }
    this.resetState(); // Скидаємо стан до початкового значення
    this.setState({ searchQuery }); // Встановлюємо новий запит для пошуку
  };

  handleSelectedImage = (largeImageUrl, tags) => {
    this.setState({
      selectedImage: largeImageUrl, // Зберігаємо URL великого зображення
      alt: tags, // Зберігаємо теги зображення
    });
  };

  resetState = () => {
    this.setState({
      searchQuery: '', // Скидаємо значення пошукового запиту
      page: 1, // Скидаємо значення сторінки до початкового значення
      images: [], // Очищуємо масив зображень
      selectedImage: null, // Скидаємо обране зображення
      alt: null, // Скидаємо значення альтернативного тексту
      status: 'idle', // Встановлюємо статус "idle" (початковий статус)
    });
  };

  loadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1, // Збільшуємо значення сторінки на одиницю для завантаження наступної сторінки зображень
    }));
  };

  closeModal = () => {
    this.setState({
      selectedImage: null, // Закриваємо модальне вікно шляхом скидання значення обраного зображення
    });
  };

  render() {
    const { images, status, selectedImage, alt, error } = this.state;
    return (
      <AppContainer>
        <SearhBar onSubmit={this.handleFormSubmit} />
        <ToastContainer autoClose={2000} theme="colored" pauseOnHover />
        {status === 'pending' && <Spiner />}
        {error && (
          <h1 style={{ color: 'orangered', textAlign: 'center' }}>
            {error.message}
          </h1> // Відображаємо повідомлення про помилку, якщо виникла помилка
        )}{' '}
        {images.length > 0 && (
          <ImageGallery
            images={images}
            selectedImage={this.handleSelectedImage}
          />
          // Відображаємо галерею зображень, якщо є зображення
        )}
        {images.length > 0 && images.length !== this.totalHits && (
          <LoadMoreButton onClick={this.loadMore} />
          // Відображаємо кнопку "Завантажити ще", якщо є ще зображення для завантаження
        )}
        {selectedImage && (
          <Modal
            selectedImage={selectedImage} // Відображаємо модальне вікно з великим зображенням, якщо є обране зображення
            tags={alt}
            onClose={this.closeModal}
          />
        )}
      </AppContainer>
    );
  }
}

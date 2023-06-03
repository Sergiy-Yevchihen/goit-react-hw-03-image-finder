import React, { Component } from 'react';
import * as API from '../services/Api';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import { AppDiv } from './App.styled';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  state = {
    images: [],
    isLoading: false,
    error: null,
    query: '',
    page: 1,
    showModal: false,
    selectedImage: null,
    isLastPage: false,
    totalPages: 0,
  };

  componentDidUpdate(_, prevState) {
    if (
      prevState.query !== this.state.query ||
      prevState.page !== this.state.page
    ) {
      this.fetchImages();
    }
  }

  loadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  fetchImages = async () => {
    const { query, page } = this.state;

    try {
      this.setState({ isLoading: true });
      const data = await API.getImages(query, page);

      if (data.hits.length === 0) {
        toast.error('Sorry, there are no images matching your request...');
        return;
      }

      const normalizedImages = API.normalizedImages(data.hits);

      this.setState(prevState => ({
        images: [...prevState.images, ...normalizedImages],
        isLastPage:
          prevState.images.length + normalizedImages.length >= data.totalHits,
        error: null,
        totalPages: Math.ceil(data.totalHits / API.perPage),
      }));
    } catch (error) {
      this.setState({ error: error.message });
      toast.error('Sorry, something went wrong.');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSearchSubmit = query => {
    if (this.state.query === query) {
      return;
    }

    this.setState({
      query: query,
      page: 1,
      images: [],
      error: null,
      isLastPage: false,
    });
  };

  handleImageClick = image => {
    this.setState({ selectedImage: image, showModal: true });
  };

  handleModalClose = () => {
    this.setState({ selectedImage: null, showModal: false });
  };

  render() {
    const { images, isLoading, error, showModal, selectedImage, isLastPage } =
      this.state;

    return (
      <AppDiv>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
        />
        <Searchbar onSubmit={this.handleSearchSubmit} />

        {error && <p>Error: {error}</p>}

        <ImageGallery images={images} onItemClick={this.handleImageClick} />

        {isLoading && <Loader />}

        {!isLoading && images.length > 0 && !isLastPage && (
          <Button onClick={this.loadMore} />
        )}

        {showModal && (
          <Modal image={selectedImage} onClose={this.handleModalClose} />
        )}
      </AppDiv>
    );
  }
}

export default App;

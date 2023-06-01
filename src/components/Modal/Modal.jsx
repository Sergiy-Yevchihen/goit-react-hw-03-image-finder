import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Overlay, ModalDiv } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

//class Modal extends Component 
 export default class Modal extends Component {
  static propTypes = {
    selectedImage: PropTypes.string,
    tags: PropTypes.string,
    onClose: PropTypes.func,
  };
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    document.body.style.overflow = 'visible';
  }

  handleKeyDown = event => {
    if (event.code === 'Escape') {
      this.props.onClose();
    }
  };

  handleClick = event => {
    if (event.target === event.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    const { image } = this.props;

    return createPortal(
      <Overlay onClick={this.handleClick}>
        <ModalDiv>
          <img src={image.largeImageURL} alt={image.tags} />
        </ModalDiv>
      </Overlay>,
      modalRoot
    );
    
  }
}

// Modal.propTypes = {
//   image: PropTypes.shape({
//     largeImageURL: PropTypes.string.isRequired,
//   }).isRequired,
//   onClose: PropTypes.func.isRequired,
// };

// export default Modal;

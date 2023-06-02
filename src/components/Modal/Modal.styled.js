import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(37, 37, 37, 0.8);
  // z-index: 1200;
`;

export const ModalDiv = styled.div`
  max-width: calc(100vw - 40px);
  max-height: calc(100vh -30px);
  // display: flex;
  //  justify-content: center;
  //  align-items: center;
 
`;

export const ModalDivImg = styled.img`
  max-width: calc(70vw - 48px);
  max-height: calc(70vh - 24px);
  border-radius: 12px;
`;
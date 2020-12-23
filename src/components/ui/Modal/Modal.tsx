import useHandleClickOutside from 'hooks/useHandleClickOutside';
import usePushToFront from 'hooks/usePushToFront';
import React, { useRef } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import { ButtonTertiary } from '../Buttons';

const ModalContainer = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 1000000;
  background: rgba(0, 0, 0, 0.2);

  #x {
    margin-left: auto;
    position: absolute;
    top: 0;
    right: 1rem;
    padding: 0;
    color: rgba(0, 0, 0, 0.4);
    &:hover {
      color: ${Styles.purple400};
    }
  }

  .modal-body {
    padding: 2rem;
    position: absolute;
    background: white;
    top: 20%;
    left: 25%;
    width: 50%;
    height: 50%;
    border-radius: ${Styles.defaultBorderRadius};

    @media (max-width: 1000px) {
      width: 75%;
      left: 12.5%;
      right: 12.5%;
    }
    @media (max-width: 750px) {
      width: 85%;
      left: 7.5%;
      right: 7.5%;
    }
    @media (max-width: 600px) {
      width: 95%;
      left: 2.5%;
      right: 2.5%;
    }
  }
`;

const Modal: React.FC<{
  closeModal: () => void;
}> = ({ children, closeModal }) => {
  usePushToFront();
  const modalBodyRef = useRef<HTMLDivElement>(null);
  useHandleClickOutside(modalBodyRef, closeModal);

  return (
    <ModalContainer>
      <div ref={modalBodyRef} className="modal-body">
        <ButtonTertiary onClick={closeModal} id="x">
          x
        </ButtonTertiary>
        {children}
      </div>
    </ModalContainer>
  );
};

export default Modal;

import useHandleClickOutside from 'hooks/useHandleClickOutside';
import usePushToFront from 'hooks/usePushToFront';
import React, { useRef } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const ModalContainer = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 1000000;
  background: rgba(0, 0, 0, 0.5);

  .modal-body {
    padding: 1rem;
    position: absolute;
    background: white;
    top: 20%;
    left: 25%;
    width: 50%;
    height: 50%;
    border-radius: ${Styles.defaultBorderRadius};
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
        {children}
      </div>
    </ModalContainer>
  );
};

export default Modal;

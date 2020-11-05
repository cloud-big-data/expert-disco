import { ButtonSecondary } from 'components/ui/Buttons';
import React from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const UploadCompleteContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  .icon__container {
    i {
      font-size: 10rem;
      color: ${Styles.green};
    }
  }
`;

const UploadCompleteState: React.FC<{
  closeModal?: () => void;
}> = ({ closeModal }) => (
  <UploadCompleteContainer>
    <div className="icon__container">
      <i className="far fa-check-square" />
    </div>
    <h3>Success!</h3>
    <ButtonSecondary
      onClick={e => {
        e?.stopPropagation();
        closeModal?.();
      }}
    >
      Close
    </ButtonSecondary>
  </UploadCompleteContainer>
);

export default UploadCompleteState;

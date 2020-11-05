import { ButtonDanger } from 'components/ui/Buttons';
import React from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  .x__container {
    font-size: 10rem;
    font-weight: bold;
    color: ${Styles.red};
  }
  border: 2px solid ${Styles.red};
  border-radius: ${Styles.defaultBorderRadius};
`;

const UploadErrorState: React.FC<{
  returnToUpload: () => void;
}> = ({ returnToUpload }) => (
  <ErrorContainer>
    <div className="x__container">x</div>
    <h3>There was a problem...</h3>
    <ButtonDanger
      onClick={e => {
        e?.stopPropagation();
        returnToUpload();
      }}
    >
      Try again
    </ButtonDanger>
  </ErrorContainer>
);

export default UploadErrorState;

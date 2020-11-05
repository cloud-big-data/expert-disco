import { ButtonSecondary } from 'components/ui/Buttons';
import { Label } from 'components/ui/Typography';
import React from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;

  .icon__container {
    i {
      font-size: 6rem;
      color: ${Styles.purple};
    }
  }
`;

const UploaderEmptyState: React.FC = () => (
  <Container>
    <div className="icon__container">
      <i className="fad fa-file-csv" />
    </div>
    <h3>Drag and drop your file(s) here to begin uploading</h3>
    <Label>OR</Label>
    <br />
    <ButtonSecondary>Browse files</ButtonSecondary>
  </Container>
);

export default UploaderEmptyState;

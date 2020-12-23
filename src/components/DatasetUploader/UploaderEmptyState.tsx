import { ButtonSecondary } from 'components/ui/Buttons';
import { TertiaryLabel } from 'components/ui/Typography';
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
  border: 2px dashed ${Styles.dark100};
  border-radius: ${Styles.defaultBorderRadius};
`;

const UploaderEmptyState: React.FC = () => (
  <Container>
    <h3>Drag and drop your file(s) here to begin uploading</h3>
    <TertiaryLabel style={{ marginBottom: 0 }}>OR</TertiaryLabel>
    <br />
    <ButtonSecondary>Browse files</ButtonSecondary>
  </Container>
);

export default UploaderEmptyState;

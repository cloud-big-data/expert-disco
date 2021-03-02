import Separator from 'components/Separator';
import { ButtonPrimary } from 'components/ui/Buttons';
import { Text } from 'components/ui/Typography';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';

const DisconnectedContainer = styled.div`
  margin: 7rem auto;
  width: 75%;

  @media (max-width: 900px) {
    width: 90%;
  }
  @media (max-width: 600px) {
    width: 95%;
  }
`;

const DatasetDisconnected: FC = () => {
  const history = useHistory();
  return (
    <DisconnectedContainer>
      <h6>Service is temporarily unavailable.</h6>
      <Text len="short" size="lg">
        Sorry, but it appears that our datasets service is unavailable. If you're
        seeing this message, then we've already been notified and are working on a
        solution. Please check in later.
      </Text>
      <Separator />
      <ButtonPrimary onClick={() => history.push('/home/datasets')}>
        Back to my datasets
      </ButtonPrimary>
    </DisconnectedContainer>
  );
};

export default DatasetDisconnected;

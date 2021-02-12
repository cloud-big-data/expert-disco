import Separator from 'components/Separator';
import { ButtonPrimary } from 'components/ui/Buttons';
import { Text } from 'components/ui/Typography';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';

const NotFoundContainer = styled.div`
  margin: 7rem auto;
  width: 75%;

  @media (max-width: 900px) {
    width: 90%;
  }
  @media (max-width: 600px) {
    width: 95%;
  }
`;

const DatasetNotFound: FC = () => {
  const history = useHistory();
  return (
    <NotFoundContainer>
      <h6>We can't find this dataset.</h6>
      <Text len="short" size="lg">
        Sorry, the file you have requested does not exist. Make sure that you have
        the correct URL and the file exists.
      </Text>
      <Separator />
      <ButtonPrimary onClick={() => history.push('/home/datasets')}>
        Back to my datasets
      </ButtonPrimary>
    </NotFoundContainer>
  );
};

export default DatasetNotFound;

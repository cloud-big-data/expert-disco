import { Text } from 'components/ui/Typography';
import React from 'react';
import styled from 'styled-components/macro';

const ErrorScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5rem;
  width: 100%;
  height: 100%;
  p {
    width: 50%;
  }
`;

const ErrorScreen: React.FC = () => {
  return (
    <ErrorScreenContainer>
      <h2>Server error</h2>
      <Text size="lg" len="long">
        We had a problem communicating with the Skyvue server. 
        This is our fault, not yours. Please refresh the page or try again later.
      </Text>

    </ErrorScreenContainer>
  )
}

export default ErrorScreen;
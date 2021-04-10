import React, { FC } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const Container = styled.div`
  i {
    color: ${Styles.purple400};
  }
`;

const IconWithBg: FC = ({ children }) => (
  <Container className="w-8 h-8 flex items-center justify-center border border-solid border-purple-400 bg-purple-100 rounded-full">
    {children}
  </Container>
);

export default IconWithBg;

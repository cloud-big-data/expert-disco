import React from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const ActiveDragContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 2px dashed ${Styles.purple};
  border-radius: ${Styles.defaultBorderRadius};
`;

const ActiveDragState: React.FC = () => (
  <ActiveDragContainer>
    <h3>Drop your files to begin upload</h3>
  </ActiveDragContainer>
);

export default ActiveDragState;

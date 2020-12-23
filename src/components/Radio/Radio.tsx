import { Helper } from 'components/ui/Typography';
import React from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const RadioContainer = styled.button<{ selected: boolean }>`
  background: none;
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  .indicator {
    height: 1rem;
    width: 1rem;
    border-radius: 100%;
    border: 3px solid
      ${props => (props.selected ? Styles.purple400 : Styles.purple200)};
    background: ${props => (props.selected ? Styles.purple200 : Styles.purple100)};
  }
`;

const Radio: React.FC<{
  selected: boolean;
  onClick?: () => void;
}> = ({ selected, onClick, children }) => (
  <RadioContainer selected={selected} onClick={onClick}>
    <div className="indicator" />
    <Helper>{children}</Helper>
  </RadioContainer>
);

export default Radio;

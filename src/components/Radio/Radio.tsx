import React from 'react';
import styled from 'styled-components/macro';

import { Helper } from 'components/ui/Typography';
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
  id?: string;
  name?: string;
}> = ({ selected, onClick, children, id, name }) => (
  <RadioContainer selected={selected} onClick={onClick}>
    <input
      hidden
      name={name}
      id={id}
      type="radio"
      onChange={onClick}
      checked={selected}
    />
    <div className="indicator" />
    <Helper>{children}</Helper>
  </RadioContainer>
);

export default Radio;

import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

export const ActiveInput = styled.input`
  width: 100%;
  border: none;
  padding: 0;
  font-size: 14px !important;
  background: ${Styles.defaultBgColor};
  &:focus {
    outline: none;
  }
`;

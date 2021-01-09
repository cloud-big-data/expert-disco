import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

export const OperatorBreak = styled.button`
  color: ${Styles.softGray};
  font-weight: bold;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
  margin-top: 1rem;
  padding: 0;
  display: flex;
  font-size: 0.8rem;
  max-width: 5rem;
  &:hover {
    color: ${Styles.dark400};
  }
`;

import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

export const UserContainer = styled.div`
  width: 50%;
  box-shadow: ${Styles.boxShadow};
  border-radius: 1rem;
  padding: 1.5rem;
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 20%;
  left: 25%;
  right: 25%;

  .input-group {
    width: 100%;

    input {
      width: 100%;
    }
  }

  .actions__container {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    button {
    }
  }
`;

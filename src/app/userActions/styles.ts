import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

export const UserContainer = styled.div`
  box-shadow: ${Styles.boxShadow};
  border: 2px solid ${Styles.faintBorderColor};
  width: 50%;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 25%;
  left: 25%;
  right: 25%;
  @media (max-width: 1000px) {
    width: 80%;
    left: 10%;
    right: 10%;
  }
  @media (max-width: 600px) {
    width: 95%;
    left: 2.5%;
    right: 2.5%;
    box-shadow: none;
    border: none;
  }

  .input-group {
    width: 100%;
    margin-top: 1rem;

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
      margin-bottom: 2rem;
    }
  }
`;

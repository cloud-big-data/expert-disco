import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  box-shadow: ${Styles.boxShadow};
  padding: 1rem 1.5rem;
  border-radius: ${Styles.defaultBorderRadius};
  background: white;
  border: 2px solid ${Styles.faintBorderColor};
`;

export default Card;

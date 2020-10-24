import { Link } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components/macro';

const HomeContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .actions__container {
    a {
      margin-right: 1rem;
    }
  }
`;

const Home: React.FC = () => (
  <HomeContainer>
    <h2>SkyVue Data</h2>
    <div className="actions__container">
      <Link to="/login">Login</Link>
      <Link to="/signup">Create account</Link>
    </div>
  </HomeContainer>
);

export default Home;

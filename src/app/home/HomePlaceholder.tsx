import React from 'react';
import { Helmet } from 'react-helmet';
// import styled from 'styled-components/macro';

// const HomeContainer = styled.div`
//   height: 100vh;
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;

//   .actions__container {
//     a {
//       margin-right: 1rem;
//     }
//   }
// `;

const Home: React.FC = () => (
  <Helmet>
    <meta httpEquiv="refresh" content="0; url=https://live.skyvue.io" />
  </Helmet>
);

export default Home;

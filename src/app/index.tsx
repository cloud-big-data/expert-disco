import React from 'react';
import {
  Switch,
  Route,
} from "react-router-dom";
import CustomerNav from 'components/nav';
import styled from 'styled-components/macro';

const AppContainer = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;

  .app-body__container {
    padding: 1rem;
  }
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <CustomerNav />
      <div className="app-body__container">
        <Switch>
          <Route path="/home/database">
            <p>App test</p>
          </Route>
          <Route path="/">
            <p>App home</p>
          </Route>
        </Switch>
      </div>
    </AppContainer>
  )
}

export default App;
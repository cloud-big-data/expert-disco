import React, { useContext } from 'react';
import {
  Switch,
  Route,
} from "react-router-dom";
import CustomerNav from 'components/nav';
import styled from 'styled-components/macro';
import AppHome from './appHome';
import Styles from 'styles/Styles';
import UserContext from 'contexts/userContext';
import Loading from 'components/ui/Loading';
import AccountManagement from './accountManagement';

const AppContainer = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;

  .app-body__container {
    max-width: ${Styles.defaultMaxWidth};
    width: 100%;
    margin: 0 auto;
    padding-top: 3rem;
  }
`;

const App: React.FC = () => {
  const user = useContext(UserContext);

  if (!user.email) return (
    <div className="absolute__center">
      <Loading />
    </div>
  )

  return (
    <AppContainer>
      <CustomerNav email={user.email} />
      <div className="app-body__container">
        <Switch>
          <Route path={`/home/account`}>
            <AccountManagement />
          </Route>
          <Route path={`/home/:view?`}>
            <AppHome />
          </Route>
        </Switch>
      </div>
    </AppContainer>
  )
}

export default App;
import ViewWithLeftNav from 'components/ViewWithLeftNav';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'querystring';

const AccountManagement: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const querystring = queryString.parse(location.search);
  const view = querystring['?view'] as string ?? 'profile';

  return (
    <ViewWithLeftNav 
      setView={(newView: string) => {
        history.push(`/home/account?${queryString.stringify({
          view: newView,
        })}`);
      }}
      activeView={view}
      options={[
        { 
          label: "Profile",
          value: "profile",
          icon: <i className="fad fa-user" />
        },
        { 
          label: "Billing",
          value: "billing",
          icon: <i className="fad fa-credit-card" />
        },
        { 
          label: "Security log",
          value: "security",
          icon: <i className="fad fa-shield-alt" />
        },
      ]}
    >
      {view === 'profile' && (
        <p>Profile</p>
      )}
      {view === 'billing' && (
        <p>Billing</p>
      )}
      {view === 'security' && (
        <p>Security</p>
      )}
    </ViewWithLeftNav>
  )
}

export default AccountManagement;
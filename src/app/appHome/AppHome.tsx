import ViewWithLeftNav from 'components/ViewWithLeftNav';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

const AppHome: React.FC = () => {
  const { view } = useParams<{view: string}>();
  const history = useHistory();

  useEffect(() => {
    if (!view) {
      history.replace("/home/my_tables");
    }
  }, [history, view])

  return (
    <ViewWithLeftNav
      setView={(newView: string) => {
        history.push(`/home/${newView}`);
      }}
      activeView={view}
      options={[
        { 
          label: "My tables",
          value: "my_tables",
          icon: <i className="fal fa-database" />
        },
        { 
          label: "Shared with me",
          value: "shared",
          icon: <i className="fad fa-share-alt" />
        },
        { 
          label: "Workspaces",
          value: "workspaces",
          icon: <i className="fad fa-layer-group" />
        },
      ]}>
        <h3 style={{ marginTop: 0 }}>
          {view === "my_tables" ? (
            `My tables`
          ) : view === "shared" ? (
            `Shared with me`
          ) : view === "workspaces" ? (
            `Workspaces`
          ) : <></>}
        </h3>
    </ViewWithLeftNav>
  )
}

export default AppHome;
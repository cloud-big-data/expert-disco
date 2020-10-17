import ViewWithLeftNav from 'components/ViewWithLeftNav';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import MyDatasets from './MyDatasets';

const AppHome: React.FC = () => {
  const { view } = useParams<{view: string}>();
  const history = useHistory();

  useEffect(() => {
    if (!view) {
      history.replace("/home/datasets");
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
          label: "My datasets",
          value: "datasets",
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
        {view === "datasets" && (
          <MyDatasets />
        )}
        {view === "shared" && (
          `Shared with me`
        )}
        {view === "workspaces" && (
          `Workspaces`
        )}
    </ViewWithLeftNav>
  )
}

export default AppHome;
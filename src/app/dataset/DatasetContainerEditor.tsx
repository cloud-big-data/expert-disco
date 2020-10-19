import CustomerNav from 'components/nav';
import Loading from 'components/ui/Loading';
import UserContext from 'globals/userContext';
import React, { useContext } from 'react';

const DatasetContainerEditor: React.FC = ({ children }) => {
  const user = useContext(UserContext);

  return (
    !user.email ? (
      <div className="absolute__center">
        <Loading />
      </div>
    ): (
      <React.Fragment>
        <CustomerNav email={user.email} />
        { children }
      </React.Fragment>
    )
  )
}

export default DatasetContainerEditor;
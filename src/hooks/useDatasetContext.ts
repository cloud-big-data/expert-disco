import { useContext } from 'react';
import DatasetContext from 'contexts/DatasetContext';

const useDatasetContext = () => {
  const context = useContext(DatasetContext);
  return context;
};

export default useDatasetContext;

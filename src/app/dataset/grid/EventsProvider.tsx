import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect } from 'react';
import makeHandleKeyPress from '../lib/makeHandleKeyPress';

const EventsProvider: React.FC = ({ children }) => {
  const { boardState, boardData, setBoardState } = useContext(DatasetContext)!;
  const handleKeyPress = makeHandleKeyPress({
    setBoardState,
    boardState,
    boardData,
  });

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  });

  return <>{children}</>;
};

export default EventsProvider;

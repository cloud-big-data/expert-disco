import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect } from 'react';
import useHandleKeyPress from './hooks/useHandleKeyPress';

const EventsProvider: React.FC = ({ children }) => {
  const { boardState, boardData, setBoardState } = useContext(DatasetContext)!;
  const handleKeyPress = useHandleKeyPress({
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

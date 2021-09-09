import React, { FC, useEffect, useState } from 'react';
import { DangerText, Text } from 'components/ui/Typography';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import useDatasetContext from 'hooks/useDatasetContext';
import { IServerDataset } from 'app/dataset/types';
import InlineLoading from 'components/ui/InlineLoading';

const ExportContainer = styled.div``;

const SkyvueExport: FC = () => {
  const {
    socket,
    boardData: { errors },
  } = useDatasetContext()!;
  const [newDataset, setNewDataset] = useState<IServerDataset>();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    socket?.on('newDataset', (duplicated: IServerDataset) =>
      setNewDataset(duplicated),
    );

    return () => {
      socket?.removeAllListeners();
    };
  }, [socket]);

  useEffect(() => {
    const [relevantError] = errors?.filter(err => err.section === 'export') ?? [];
    if (relevantError) {
      setErrorMessage(relevantError.message);
    } else {
      setErrorMessage('');
    }
  }, [errors]);

  return (
    <ExportContainer>
      <h5>
        {errorMessage
          ? 'There was a problem...'
          : newDataset === undefined
          ? 'Duplicating'
          : 'Export complete!'}
      </h5>
      {errorMessage ? (
        <DangerText size="sm" len="short">
          {errorMessage}. Please try again later.
        </DangerText>
      ) : newDataset === undefined ? (
        <div className="flex items-center mx-auto">
          <InlineLoading />
        </div>
      ) : (
        <Text size="sm" len="short">
          Your dataset is ready!{' '}
          <Link
            className="underline text-purple-400"
            to={`/dataset/${newDataset?._id}`}
            target="_blank"
            rel="noopener"
          >
            View it here.
          </Link>
        </Text>
      )}
    </ExportContainer>
  );
};

export default SkyvueExport;

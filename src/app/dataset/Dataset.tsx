import React from 'react';
import styled from 'styled-components/macro';
// import { useParams } from 'react-router-dom';
import Grid from './grid';

const DatasetContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  height: 100%;
  max-height: 100%;
`;
const ParentGridContainer = styled.div`
  flex: 1 0 auto;
  display: flex;
  width: 100%;
  height: 100%;
`;
const ToolbarContainer = styled.div``;

const Dataset: React.FC = () => {
  // const params = useParams();

  return (
    <DatasetContainer>
      <ToolbarContainer>
        <p>Tools</p>
      </ToolbarContainer>
      <ParentGridContainer>
        <Grid />
      </ParentGridContainer>
    </DatasetContainer>
  )
}

export default Dataset;
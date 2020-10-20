import InputField from 'components/ui/InputField';
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
  padding: 1rem;
`;
const ParentGridContainer = styled.div`
  flex: 1 0 auto;
  display: flex;
  width: 100%;
  height: 100%;
`;
// const ToolbarContainer = styled.div`
// `;
const FormulaBarContainer = styled.div`
  display: flex;
  align-items: center;
  input {
    width: 100%;
    margin-left: .25rem;
  }
`;

const Dataset: React.FC<{
  readOnly?: boolean;
}> = () => {
  // const params = useParams();

  return (
    <DatasetContainer>
      {/* <ToolbarContainer>
        <p>Tools</p>
      </ToolbarContainer> */}
      <FormulaBarContainer>
        <InputField icon={<i className="fad fa-function" />} />
      </FormulaBarContainer>
      <ParentGridContainer>
        <Grid />
      </ParentGridContainer>
    </DatasetContainer>
  )
}

export default Dataset;
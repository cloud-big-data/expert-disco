import Metric from 'components/Metric';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const DatasetSummaryContainer = styled.div`
  display: grid;
  grid-template-columns: auto 3fr;
  grid-column-gap: 1rem;
  .summary_metrics__container {
    padding-right: 1rem;
    display: flex;
    flex-direction: column;
    div:not(:nth-of-type(1)) {
      margin-top: 1rem;
    }
    border-right: 2px solid ${Styles.faintBorderColor};
  }
`;

// total records
// total columns
// file size
// data types
// does it fit?
const DatasetSummary: React.FC = () => {
  const { boardData } = useContext(DatasetContext)!;
  return (
    <DatasetSummaryContainer>
      <div className="summary_metrics__container">
        <Metric label="records" value={boardData.rows.length} commas />
        <Metric label="columns" value={boardData.columns.length} />
        <Metric label="file size" value="23mb" />
      </div>
      <div className="columns__container">hi</div>
    </DatasetSummaryContainer>
  );
};

export default DatasetSummary;

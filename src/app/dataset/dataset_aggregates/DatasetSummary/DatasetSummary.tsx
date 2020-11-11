import Metric from 'components/Metric';
import { Label } from 'components/ui/Typography';
import * as R from 'ramda';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import humanFileSize from 'utils/humanFileSize';

const DatasetSummaryContainer = styled.div`
  display: grid;
  grid-template-columns: auto 2fr auto;
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

  .fit__container {
    display: flex;
    flex-direction: column;
    .row {
      display: flex;
      align-items: center;
      i {
        margin-right: 0.5rem;
      }
    }
  }
`;

interface ISizeLimits {
  [key: string]: number | undefined;
  cells?: number;
  size?: number;
  rows?: number;
  columns?: number;
}

interface IOtherDatatools {
  label: string;
  value: string;
  limits: ISizeLimits;
}

const OTHER_DATATOOLS: IOtherDatatools[] = [
  {
    label: 'Google sheets',
    value: 'sheets',
    limits: {
      cells: 400000,
      size: 20000000,
      columns: 256,
    },
  },
  {
    label: 'Excel',
    value: 'excel',
    limits: {
      rows: 1048576,
      columns: 16384,
      size: 1000000000,
    },
  },
  {
    label: 'Airtable',
    value: 'airtable',
    limits: {
      rows: 50000,
    },
  },
];

const validateSizeLimits = (
  currentSize: ISizeLimits,
  tool: IOtherDatatools['limits'],
) => {
  const commonLimits = R.intersection(R.keys(currentSize), R.keys(tool));
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return R.all((limit: string) => currentSize[limit]! <= tool[limit]!)(commonLimits);
};

const DatasetSummary: React.FC = () => {
  const { boardData, datasetHead } = useContext(DatasetContext)!;
  const { skyvueFileSize, csvFileSize } = datasetHead;
  const rowLength = boardData.rows.length;
  const colLength = boardData.columns.length;
  const sizeLimits: ISizeLimits = {
    rows: rowLength,
    columns: colLength,
    cells: rowLength * colLength,
    size: csvFileSize,
  };

  return (
    <DatasetSummaryContainer>
      <div className="summary_metrics__container">
        <Metric label="records" value={boardData.rows.length} commas />
        <Metric label="columns" value={boardData.columns.length} />
        <Metric
          label="Skyvue file size"
          value={skyvueFileSize ? humanFileSize(skyvueFileSize) : undefined}
        />
        <Metric
          label="Est. CSV file size"
          value={csvFileSize ? humanFileSize(csvFileSize) : undefined}
        />
      </div>
      <div className="columns__container">hi</div>
      <div className="fit__container">
        <h6>
          Compatible with
          <br />
          other data tools?
        </h6>
        {OTHER_DATATOOLS.map(tool => (
          <div key={tool.value} className="row">
            {validateSizeLimits(sizeLimits, tool.limits) ? (
              <i style={{ color: Styles.green }} className="fas fa-check-square" />
            ) : (
              <i style={{ color: Styles.red }} className="fad fa-times-square" />
            )}
            <Label unBold>{tool.label}</Label>
          </div>
        ))}
      </div>
    </DatasetSummaryContainer>
  );
};

export default DatasetSummary;

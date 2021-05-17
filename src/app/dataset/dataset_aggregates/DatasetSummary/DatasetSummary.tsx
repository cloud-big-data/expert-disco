import Metric from 'components/Metric';
import { Label } from 'components/ui/Typography';
import * as R from 'ramda';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import humanFileSize from 'utils/humanFileSize';
import ColumnSummaries from './ColumnSummaries';

const DatasetSummaryContainer = styled.div`
  .summary_metrics__container {
    padding-right: 1rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    div:not(:nth-of-type(1)) {
      margin-top: 1rem;
    }
  }

  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
    .summary_metrics__container {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 0.25rem;
      margin-bottom: 1rem;
      width: 100%;
      border-right: none;
      border-bottom: 2px solid ${Styles.faintBorderColor};
      div:not(:nth-of-type(1)) {
        margin-top: 0;
        margin-left: 1rem;
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
) =>
  R.all((limit: string) => currentSize[limit]! <= tool[limit]!)(
    R.intersection(R.keys(currentSize), R.keys(tool)) as string[],
  );

const DatasetSummary: React.FC = () => {
  const { boardData, datasetHead } = useContext(DatasetContext)!;
  const { skyvueFileSize, csvFileSize, rowCount } = datasetHead;

  const colLength = boardData.columns.length;
  const sizeLimits: ISizeLimits = {
    rows: rowCount,
    columns: colLength,
    cells: rowCount ?? 1 * colLength,
    size: csvFileSize,
  };

  return (
    <DatasetSummaryContainer>
      <div className="flex flex-col md:flex-row justify-between xl:w-1/2 md:w-full mx-auto space-y-8 md:space-y-0">
        <div className="flex items-center space-x-4 border-dark-100 border-solid mx-auto">
          <Metric label="records" value={rowCount} commas />
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
        <div className="flex flex-col mx-auto">
          <h6>Compatible with other data tools?</h6>
          <div className="flex items-center space-x-4">
            {OTHER_DATATOOLS.map(tool => (
              <div key={tool.value} className="flex items-center space-x-2">
                {validateSizeLimits(sizeLimits, tool.limits) ? (
                  <i
                    style={{ color: Styles.green }}
                    className="fas fa-check-square"
                  />
                ) : (
                  <i
                    style={{ color: Styles.red400 }}
                    className="fad fa-times-square"
                  />
                )}
                <Label unBold>{tool.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fields__container">
        <ColumnSummaries />
      </div>
    </DatasetSummaryContainer>
  );
};

export default DatasetSummary;

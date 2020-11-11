import Metric from 'components/Metric';
import { Label } from 'components/ui/Typography';
import * as R from 'ramda';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import humanFileSize from 'utils/humanFileSize';
import { DataTypes } from 'app/dataset/types';

const DatasetSummaryContainer = styled.div`
  display: grid;
  grid-template-columns: auto 2fr auto;
  grid-column-gap: 1rem;
  overflow: hidden;

  .summary_metrics__container {
    padding-right: 1rem;
    display: flex;
    flex-direction: column;
    div:not(:nth-of-type(1)) {
      margin-top: 1rem;
    }
    border-right: 2px solid ${Styles.faintBorderColor};
  }

  .fields__container {
    display: flex;
    flex-direction: column;
    max-height: inherit;
    overflow: auto;

    .fields__table {
      display: grid;
      grid-template-columns: repeat(3, auto);
    }
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
      <div className="fields__container">
        <h6>Fields</h6>
        <div className="fields__table">
          {boardData.columns.map((col, index) => (
            <React.Fragment key={col._id}>
              {index === 0 && (
                <>
                  <div className="field__name">
                    <Label>Field</Label>
                  </div>
                  <div className="field__name">
                    <Label>Data type</Label>
                  </div>
                  <div className="field__name">
                    <Label>Format</Label>
                  </div>
                </>
              )}
              <div className="field">
                <Label unBold>{col.value}</Label>
              </div>
              <div className="field">
                <Label unBold>{DataTypes[col.dataType]}</Label>
              </div>
              <div />
            </React.Fragment>
          ))}
        </div>
      </div>
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

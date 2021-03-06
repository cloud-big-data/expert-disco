import DatasetContext from 'contexts/DatasetContext';
import React, { FC, useContext } from 'react';

import styled from 'styled-components/macro';
import { Table, Tabs } from 'antd';
import { IColumn, IColumnSummary } from 'app/dataset/types';

import * as R from 'ramda';

const { TabPane } = Tabs;

const makeSorterFunction = (key: string) => (a: any, b: any) =>
  a[key] && b[key]
    ? parseFloat(a[key]?.replace(/,/g, '')) - parseFloat(b[key]?.replace(/,/g, ''))
    : a[key];

const BASE_COLUMNS = [
  {
    title: 'Field name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Unique values',
    dataIndex: 'uniqueValues',
    key: 'uniqueValues',
    sorter: makeSorterFunction('uniqueValues'),
  },
];
const COLUMNS = [
  ...BASE_COLUMNS,
  {
    title: 'Sum',
    dataIndex: 'sum',
    key: 'sum',
    sorter: makeSorterFunction('sum'),
  },
  {
    title: 'Average (mean)',
    dataIndex: 'mean',
    key: 'mean',
    sorter: makeSorterFunction('mean'),
  },
  {
    title: 'Min value',
    dataIndex: 'min',
    key: 'min',
    sorter: makeSorterFunction('min'),
  },
  {
    title: 'Max value',
    dataIndex: 'max',
    key: 'max',
    sorter: makeSorterFunction('max'),
  },
];

const ColumnSummariesContainer = styled.div`
  max-width: 60vw;
  overflow: auto;

  @media (max-width: 700px) {
    max-width: 70vw;
  }
`;

const displayNumber = (input?: number) =>
  input?.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const returnMakeTableFromDataType = (columnSummary: IColumnSummary) => (
  columns: IColumn[],
) => (
  <Table
    showSorterTooltip={false}
    columns={columns[0]?.dataType === 'string' ? BASE_COLUMNS : COLUMNS}
    pagination={false}
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dataSource={R.sortBy(R.prop('value'), columns).map((col, index) => {
      const { uniqueValues, sum, mean, min, max } = columnSummary[col._id] ?? {};
      return {
        key: index,
        name: <strong>{col.value}</strong>,
        dataType: col.dataType,
        uniqueValues: displayNumber(uniqueValues),
        sum: displayNumber(sum),
        mean: displayNumber(mean),
        min: displayNumber(min),
        max: displayNumber(max),
      };
    })}
  />
);

const ColumnSummaries: FC = () => {
  const { boardData } = useContext(DatasetContext)!;
  const { columns, columnSummary } = boardData;
  const makeTable = returnMakeTableFromDataType(columnSummary);
  return (
    <ColumnSummariesContainer>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Number columns" key="1">
          {makeTable(columns.filter(col => col.dataType === 'number'))}
        </TabPane>
        <TabPane tab="Text columns" key="2">
          {makeTable(columns.filter(col => col.dataType === 'string'))}
        </TabPane>
        <TabPane tab="Date columns" key="3">
          {makeTable(columns.filter(col => col.dataType === 'date'))}
        </TabPane>
      </Tabs>
    </ColumnSummariesContainer>
  );
};

export default ColumnSummaries;

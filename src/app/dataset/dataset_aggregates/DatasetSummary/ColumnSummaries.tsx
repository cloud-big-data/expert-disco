import DatasetContext from 'contexts/DatasetContext';
import React, { FC, useContext } from 'react';

import styled from 'styled-components/macro';
import { Table } from 'antd';

const COLUMNS = [
  {
    title: 'Field name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Data type',
    dataIndex: 'dataType',
    key: 'dataType',
  },
  {
    title: 'Unique values',
    dataIndex: 'uniqueValues',
    key: 'uniqueValues',
  },
  {
    title: 'Sum',
    dataIndex: 'sum',
    key: 'sum',
  },
  {
    title: 'Average (mean)',
    dataIndex: 'mean',
    key: 'mean',
  },
  {
    title: 'Min value',
    dataIndex: 'min',
    key: 'min',
  },
  {
    title: 'Max value',
    dataIndex: 'max',
    key: 'max',
  },
];

const ColumnSummariesContainer = styled.div``;

const ColumnSummaries: FC = () => {
  const { boardData } = useContext(DatasetContext)!;
  const { columns } = boardData;

  return (
    <ColumnSummariesContainer>
      <Table
        columns={COLUMNS}
        pagination={false}
        dataSource={columns.map((col, index) => ({
          key: index,
          name: <strong>{col.value}</strong>,
          dataType: col.dataType,
          uniqueValues: 3,
          sum: 3,
          mean: 3,
          min: 3,
          max: 3,
        }))}
      />
    </ColumnSummariesContainer>
  );
};

export default ColumnSummaries;

import { DataTypes } from 'app/dataset/types';
import React from 'react';
import styled from 'styled-components/macro';

const IconContainer = styled.div`
  display: flex;
  margin-right: 0.5rem;
  i {
    color: rgba(0, 0, 0, 0.4);
  }
`;

const ColumnTypeIcon: React.FC<{
  dataType: DataTypes;
}> = ({ dataType }) => (
  <IconContainer>
    {dataType === 'string' ? (
      <i className="fad fa-text-size" />
    ) : dataType === 'number' ? (
      <i className="fad fa-hashtag" />
    ) : dataType === 'date' ? (
      <i className="fad fa-calendar" />
    ) : (
      <></>
    )}
  </IconContainer>
);

export default ColumnTypeIcon;

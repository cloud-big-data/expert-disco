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
    {dataType === DataTypes.string ? (
      <i className="fad fa-text-size" />
    ) : dataType === DataTypes.number ? (
      <i className="fad fa-hashtag" />
    ) : dataType === DataTypes.date ? (
      <i className="fad fa-calendar" />
    ) : (
      <></>
    )}
  </IconContainer>
);

export default ColumnTypeIcon;

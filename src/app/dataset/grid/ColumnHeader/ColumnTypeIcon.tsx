import { DataTypes } from 'app/dataset/types';
import React from 'react';

export const ColumnTypeStyle = {
  display: 'flex',
  marginRight: '0.5rem',
  color: 'rgba(0, 0, 0, .4)',
};

const ColumnTypeIcon: React.FC<{
  dataType: DataTypes;
}> = ({ dataType }) =>
  dataType === 'string' ? (
    <i className="fad fa-text-size" style={ColumnTypeStyle} />
  ) : dataType === 'number' ? (
    <i className="fad fa-hashtag" style={ColumnTypeStyle} />
  ) : dataType === 'date' ? (
    <i className="fad fa-calendar" style={ColumnTypeStyle} />
  ) : (
    <></>
  );

export default ColumnTypeIcon;

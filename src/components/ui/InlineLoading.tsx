import ReactLoading from 'react-loading-components';
import React from 'react';
import Styles from '../../styles/Styles';

const InlineLoading: React.FC<{ style?: React.CSSProperties; fill?: string }> = ({
  style,
  fill,
}) => (
  <ReactLoading
    style={style}
    width={style?.width ?? 50}
    height={style?.height ?? 15}
    type="three_dots"
    fill={fill ?? Styles.blue}
  />
);

export default InlineLoading;

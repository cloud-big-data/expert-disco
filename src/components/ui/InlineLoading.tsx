import ReactLoading from 'react-loading-components';
import React from 'react';
import Styles from '../../styles/Styles';

const InlineLoading: React.FC = () => (
  <ReactLoading type="three_dots" fill={Styles.blue} />
);

export default InlineLoading;

import React from 'react';
import ReactLoading from 'react-loading-components';
import Styles from 'styles/Styles';

const Loading: React.FC = () => {
  return <ReactLoading type='bars' fill={Styles.purple} />
}

export default Loading;
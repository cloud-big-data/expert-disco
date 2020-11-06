import Loading from 'components/ui/Loading';
import React from 'react';
import styled from 'styled-components/macro';

const LoadingStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const UploadLoadingState: React.FC = () => (
  <LoadingStateContainer>
    <Loading />
    <h3>Uploading...</h3>
  </LoadingStateContainer>
);

export default UploadLoadingState;

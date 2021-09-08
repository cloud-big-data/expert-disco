import React, { FC } from 'react';
import { Text } from 'components/ui/Typography';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

const ExportContainer = styled.div``;

const SkyvueExport: FC = () => (
  <ExportContainer>
    <h5>Export complete!</h5>
    <Text size="sm" len="short">
      Go to{' '}
      <Link className="underline text-purple-400" to="/my_datasets">
        your datasets
      </Link>{' '}
      to view.
    </Text>
  </ExportContainer>
);

export default SkyvueExport;

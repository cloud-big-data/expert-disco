import InlineLoading from 'components/ui/InlineLoading';
import { Helper } from 'components/ui/Typography';
import React from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import addCommas from 'utils/addCommas';

const MetricContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  h5 {
    color: ${Styles.purple};
    margin: 0;
  }
`;

const LabelContainer = styled.div``;
// const SecondaryLabel = styled.span`
//   color: ${Styles.softGray};
//   font-weight: 600;
//   font-size: 1rem;
// `;

const Metric: React.FC<{
  value?: string | number;
  label?: string;
  commas?: boolean;
}> = ({ value, label, commas }) => (
  <MetricContainer>
    {value ? (
      <h5>{commas && typeof value === 'number' ? addCommas(value) : value}</h5>
    ) : (
      <InlineLoading />
    )}
    <LabelContainer>
      <Helper style={{ margin: 0 }}>{label}</Helper>
    </LabelContainer>
  </MetricContainer>
);

export default Metric;

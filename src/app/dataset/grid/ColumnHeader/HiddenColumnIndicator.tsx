import { Tooltip } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components/macro';

const Container = styled.button`
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-right: none;
  width: 32px;
  max-width: 32px;
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: center;
  background: #f1eff3;
  height: 2rem;
  cursor: pointer;

  &:hover {
    opacity: 0.3;
  }
`;

const HiddenColumnIndicator: FC<{
  onShow: () => void;
  value?: string;
}> = ({ onShow, value }) => (
  <Container onClick={onShow}>
    <Tooltip color="white" title={value ?? 'Hidden column'}>
      <i className="fal fa-arrows-h" />
    </Tooltip>
  </Container>
);

export default HiddenColumnIndicator;

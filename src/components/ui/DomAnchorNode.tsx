import React, { FC, ReactNode } from 'react';
import styled from 'styled-components/macro';
import useDomNodeBox from 'hooks/useDomNodeBox';

export interface IDomNodeSelector {
  selector: string;
}

const debug_anchor_node = false;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.debug_anchor_node = debug_anchor_node;

const DomAnchorNode: FC<{
  domNodeSelector: IDomNodeSelector;
  children: ReactNode;
}> = ({ domNodeSelector, children }) => {
  const positioning = useDomNodeBox(domNodeSelector);

  const { left, top, width, height } = positioning ?? {};
  const Container = styled.div`
    position: absolute;
    left: ${left}px;
    top: ${top}px;
    width: ${width}px;
    height: ${height}px;
    ${debug_anchor_node ? 'border: 1px dashed red;' : ''}
  `;

  return <Container>{children}</Container>;
};

export default DomAnchorNode;

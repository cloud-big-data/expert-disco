import { makeBoardActions } from 'app/dataset/lib/makeBoardActions';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import { defaults } from '../constants';

const ColEdgeContainer = styled.div<{
  hovering: boolean;
  width: number;
}>`
  display: flex;
  margin-left: auto;
  padding-right: 2rem;
  height: 2rem;
  width: 0px;
  border-right: 3px solid ${props => (props.hovering ? Styles.blue : 'transparent')};
  cursor: ew-resize;
`;

const WidthIndicator = styled.div`
  position: absolute;
  height: 100%;
  border-right: 3px solid ${Styles.blue};
`;

const DraggableColEdge: React.FC<{
  colWidth: number;
  colId: string;
}> = ({ colWidth, colId }) => {
  const { boardData, setBoardData } = useContext(DatasetContext)!;
  const [hovering, toggleHovering] = useState(false);
  const [mouseIsDown, toggleMouseIsDown] = useState(false);

  const xRef = useRef<HTMLDivElement>(null);
  const startDragPos = useRef<number | null>(null);
  const edgeRef = useRef<HTMLDivElement>(null);

  const boardActions = makeBoardActions(boardData);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      e.stopPropagation?.();
      if (e.target !== edgeRef.current) return;
      document.querySelector('body')!.style.cursor = 'grab';
      toggleMouseIsDown(true);

      startDragPos.current = e.pageX;
      if (xRef.current) {
        xRef.current.style.left = `${e.pageX}px`;
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!xRef.current) return;
      xRef.current.style.left = `${e.pageX}px`;
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (!mouseIsDown) return;
      toggleMouseIsDown(false);
      document.querySelector('body')!.style.cursor = 'unset';
      const newWidth = colWidth + (e.pageX - startDragPos.current!);

      if (newWidth < 5) return;
      setBoardData!(
        boardActions.changeColWidth(
          colId,
          colWidth + (e.pageX - startDragPos.current!),
        ),
      );
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [boardActions, colId, colWidth, mouseIsDown, setBoardData]);

  return (
    <ColEdgeContainer
      ref={edgeRef}
      width={colWidth ?? defaults.COL_WIDTH}
      hovering={hovering}
      onMouseEnter={() => toggleHovering(true)}
      onMouseLeave={() => toggleHovering(false)}
    >
      {mouseIsDown && <WidthIndicator ref={xRef} />}
    </ColEdgeContainer>
  );
};

export default DraggableColEdge;

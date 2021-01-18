import findColumnById from 'app/dataset/lib/findColumnById';
import { makeBoardActions } from 'app/dataset/lib/makeBoardActions';
import updateSmartColumnById from 'app/dataset/lib/updateSmartColumnById';
import DatasetContext from 'contexts/DatasetContext';
import GridContext from 'contexts/GridContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const ColEdgeContainer = styled.div<{
  hovering: boolean;
}>`
  display: flex;
  flex: 0 1;
  padding-right: 2rem;
  height: 2rem;
  margin-right: -2rem;
  border-left: 3px solid ${props => (props.hovering ? Styles.blue : 'transparent')};
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
  const { boardData, setBoardData, socket } = useContext(DatasetContext)!;
  const { gridRef } = useContext(GridContext)!;
  const [hovering, toggleHovering] = useState(false);
  const [mouseIsDown, toggleMouseIsDown] = useState(false);

  const xRef = useRef<HTMLDivElement>(null);
  const startDragPos = useRef<number | null>(null);
  const edgeRef = useRef<HTMLDivElement>(null);

  const boardActions = makeBoardActions(boardData);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (
        !gridRef.current?.contains(e.target as Node) &&
        e.target !== edgeRef.current
      )
        return;

      e.stopPropagation?.();
      e.preventDefault?.();
      if (!hovering) return;
      document.querySelector('body')!.style.cursor = 'grab';
      toggleMouseIsDown(true);
      startDragPos.current = e.pageX;
      if (xRef.current) {
        xRef.current.style.left = `${e.pageX - 20}px`;
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!xRef.current) return;
      xRef.current.style.left = `${e.pageX - 20}px`;
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (!mouseIsDown) return;
      toggleMouseIsDown(false);
      document.querySelector('body')!.style.cursor = 'unset';
      const newWidth = colWidth + (e.pageX - startDragPos.current!);

      if (newWidth < 15) return;

      const updatedWidth = colWidth + (e.pageX - startDragPos.current!);
      setBoardData?.(boardActions.changeColWidth(colId, updatedWidth));

      if (findColumnById(colId, boardData)?.isSmartColumn) {
        socket?.emit('layer', {
          layerKey: 'smartColumns',
          layerData: updateSmartColumnById(
            colId,
            { colWidth: updatedWidth },
            boardData,
          ),
        });
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    boardActions,
    boardData,
    colId,
    colWidth,
    gridRef,
    hovering,
    mouseIsDown,
    setBoardData,
    socket,
  ]);

  return (
    <ColEdgeContainer
      ref={edgeRef}
      hovering={hovering}
      onMouseEnter={() => toggleHovering(true)}
      onMouseLeave={() => toggleHovering(false)}
    >
      {mouseIsDown && <WidthIndicator ref={xRef} />}
    </ColEdgeContainer>
  );
};

export default DraggableColEdge;

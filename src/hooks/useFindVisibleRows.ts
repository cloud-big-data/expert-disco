/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useRef } from 'react';

const useFindVisibleRows = (
  gridRef: React.RefObject<HTMLDivElement>,
): [number, number] => {
  const [visibleRows, setVisibleRows] = useState<[number, number]>([-1, -1]);
  const scrollTimeout = useRef<any>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const handleScroll = () => {
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        const indeces = [...grid.querySelectorAll('div.row__index')]
          .filter(node => {
            const { top } = node.getBoundingClientRect();
            return top > grid.scrollTop;
          })
          // @ts-ignore
          .map(node => parseInt(node.dataset.rowIndex, 10));

        const firstTup = indeces[0] - 20 < 0 ? 0 : indeces[0] - 20;
        const secondTup = indeces[0] + 100;

        if (firstTup !== visibleRows[0] && secondTup !== visibleRows[1]) {
          setVisibleRows([firstTup, secondTup]);
        }
      }, 200);
    };

    grid.addEventListener('scroll', handleScroll);

    return () => grid.removeEventListener('scroll', handleScroll);
  }, [gridRef, visibleRows]);

  return visibleRows;
};

export default useFindVisibleRows;

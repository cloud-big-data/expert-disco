import { useState, useEffect, useRef } from 'react';
import * as R from 'ramda';

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
        const getVisibleIndeces = R.pipe(
          R.find(
            (node: any) =>
              node.getBoundingClientRect().top > grid.getBoundingClientRect().top,
          ),
          R.pathOr('0', ['dataset', 'rowIndex']),
          parseInt,
          item => (item - 20 < 0 ? 0 : item - 20),
          item => [item, item + 100] as [number, number],
        );

        const rowNodeList = [...grid.querySelectorAll('div.row__index')];
        setVisibleRows(getVisibleIndeces(rowNodeList));
      }, 200);
    };

    grid.addEventListener('scroll', handleScroll);
    return () => grid.removeEventListener('scroll', handleScroll);
  }, [gridRef]);

  return visibleRows;
};

export default useFindVisibleRows;

import { useState, useEffect } from 'react';
import * as R from 'ramda';

const useFindVisibleRows = (
  gridRef: React.RefObject<HTMLDivElement>,
  {
    first,
    last,
  }: {
    first: number;
    last: number;
  },
): [number, number] => {
  const [visibleRows, setVisibleRows] = useState<[number, number]>([first, last]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleScroll = () => {
      const getVisibleIndeces = R.pipe(
        R.find(
          (node: any) =>
            node.getBoundingClientRect().top > grid.getBoundingClientRect().top,
        ),
        R.pathOr('0', ['dataset', 'rowIndex']),
        parseInt,
        item => (item - 50 < 0 ? 0 : item - 50),
        item => [item, item + 100] as [number, number],
      );

      const rowNodeList = [...grid.querySelectorAll('div.row__index')];
      setVisibleRows(getVisibleIndeces(rowNodeList));
    };

    grid.addEventListener('scroll', handleScroll);
    return () => grid.removeEventListener('scroll', handleScroll);
  }, [gridRef]);

  return visibleRows;
};

export default useFindVisibleRows;

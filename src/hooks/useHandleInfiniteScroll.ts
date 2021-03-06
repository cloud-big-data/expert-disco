import { useState, useEffect, useRef } from 'react';
import * as R from 'ramda';

const useHandleInfiniteScroll = (
  gridRef: React.RefObject<HTMLDivElement>,
  {
    first,
    last,
  }: {
    first: number;
    last: number;
  },
  getRowSlice: (start: number, end: number) => void,
): [number, number, boolean] => {
  const [visibleRows, setVisibleRows] = useState<[number, number]>([first, last]);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef(-1);

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
        item => [item, item + 200] as [number, number],
      );

      const rowNodeList = [...grid.querySelectorAll('div.row__index')];
      const newVisibleRows = getVisibleIndeces(rowNodeList);
      setIsScrolling(true);
      setVisibleRows(newVisibleRows);
      setTimeout(() => {
        setIsScrolling(false);
      });

      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        getRowSlice(...newVisibleRows);
      }, 100);
    };

    grid.addEventListener('scroll', handleScroll);
    return () => grid.removeEventListener('scroll', handleScroll);
  }, [getRowSlice, gridRef, visibleRows]);

  return [...visibleRows, isScrolling];
};

export default useHandleInfiniteScroll;

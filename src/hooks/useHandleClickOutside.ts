import { useEffect } from 'react';

const useHandleClickOutside = (
  ref: React.RefObject<HTMLDivElement>,
  onClickOutside: () => void,
) => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref?.current?.contains(e.target as Node)) {
        onClickOutside();
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  });
};

export default useHandleClickOutside;

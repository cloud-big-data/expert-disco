import { useCallback, useEffect, useState } from 'react';
import { IDomNodeSelector } from 'components/ui/DomAnchorNode';

const useDomNodeBox = (domNodeSelector: IDomNodeSelector) => {
  const [position, setPosition] = useState<DOMRect | undefined>(undefined);

  const onResize = useCallback(() => {
    const el = document.querySelector(domNodeSelector.selector);
    const rect = el?.getBoundingClientRect();
    setPosition(rect);
  }, [domNodeSelector.selector]);

  useEffect(() => {
    onResize();
  }, [onResize]);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  });

  return position;
};

export default useDomNodeBox;

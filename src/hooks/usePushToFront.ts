import React, { useEffect } from 'react';

const usePushToFront = (ref?: React.RefObject<HTMLDivElement>) => {
  // console.log(ref?.current);
  useEffect(() => {
    document.querySelectorAll('div')?.forEach(div => {
      const style = window.getComputedStyle(div);
      if (style.getPropertyValue('position') === 'sticky') {
        div.classList.add('unsettled_divs');
        div.style.position = 'relative';
      }
    });

    return () => {
      document.querySelectorAll('div')?.forEach(div => {
        if (document.querySelectorAll('.push-to-front').length === 2) return;
        if (div.classList.contains('unsettled_divs')) {
          div.style.position = 'sticky';
          div.classList.remove('unsettled_divs');
        }
      });
    };
  }, [ref]);
};

export default usePushToFront;

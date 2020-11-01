import { useEffect } from 'react';

const usePushToFront = () => {
  useEffect(() => {
    document.querySelectorAll('div')?.forEach(div => {
      const style = window.getComputedStyle(div);
      if (style.getPropertyValue('position') === 'sticky') {
        div.classList.add('unsettled_divs');
        div.style.position = 'unset';
      }
    });

    return () => {
      document.querySelectorAll('div')?.forEach(div => {
        if (div.classList.contains('unsettled_divs')) {
          div.style.position = 'sticky';
          div.classList.remove('unsettled_divs');
        }
      });
    };
  }, []);
};

export default usePushToFront;

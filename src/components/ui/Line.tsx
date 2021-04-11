import React, { FC } from 'react';
import classNames from 'classnames';

const Line: FC<{ className?: string }> = ({ className }) => (
  <div
    className={classNames(
      'my-2 w-full border border-solid border-dark-100',
      className,
    )}
  />
);

export default Line;

import React, { FC } from 'react';

const SwitchRender: FC<{
  switchValue: string;
  caseValues: {
    [key: string]: React.ReactElement;
  };
  defaultCase?: React.ReactElement | undefined;
}> = ({ switchValue, caseValues, defaultCase }) =>
  caseValues[switchValue] ?? defaultCase ?? null;

export default SwitchRender;

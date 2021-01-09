import React from 'react';
import { Select as AntSelect } from 'antd';

interface ISelect {
  value?: string;
  placeholder?: string;
  options: Array<{
    name: string;
    value: string | number;
    disabled?: boolean;
  }>;
  onChange: (value: string) => void;
  fill?: string;
  style?: React.CSSProperties;
}

const Select: React.FC<ISelect> = ({
  placeholder,
  value,
  style,
  onChange,
  options,
}) => (
  <AntSelect
    placeholder={placeholder}
    value={options.find(opt => opt.value === value)?.name}
    style={style}
    onChange={onChange}
    options={options.map(opt => ({
      label: opt.name,
      value: opt.value,
      disabled: opt.disabled,
    }))}
  />
);

export default Select;

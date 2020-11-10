import styled from 'styled-components/macro';
import React, { useState } from 'react';
import Styles from 'styles/Styles';

const InputContainer = styled.div<{
  error: boolean;
  active: boolean;
  disabled?: boolean;
}>`
  transition-duration: 0.1s;
  display: flex;
  width: 100%;
  background: ${props => (props.disabled ? 'rgba(239, 239, 239, 0.3)' : 'white')};
  border: ${props =>
    props.error
      ? `1px solid ${Styles.red}`
      : `1px solid ${Styles.faintBorderColor}`};
  ${props =>
    props.active
      ? `
    border: 1px solid ${Styles.purple};
  `
      : ''}
  border-radius: .625rem;

  &:hover {
    ${props =>
      props.active
        ? ``
        : `
      border: 1px solid rgba(0,0,0,.2);
    `}
  }
  .icon__container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3rem;
    i {
      font-size: 1.5rem;
      ${props =>
        props.active
          ? `
        color: ${Styles.purple};
      `
          : ''}
    }
  }
`;

const Input = styled.input<{
  error?: boolean;
  icon?: boolean;
}>`
  width: 100%;
  border-radius: 0.625rem;
  height: 3rem;
  border: none;
  color: ${Styles.fontColor};
  padding: ${props => (props.icon ? '0.5rem .75rem .5rem 0' : '.5rem .75rem')};
  outline: none;
  transition-duration: 0.1s;

  &:disabled {
    background: rgba(239, 239, 239, 0.3);
  }
`;

const InputField: React.FC<{
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  type?: string;
  error?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
}> = props => {
  const [active, setActive] = useState(false);

  return (
    <InputContainer disabled={props.disabled} active={active} error={!!props.error}>
      {props.icon && <div className="icon__container">{props.icon}</div>}
      <Input
        ref={props.inputRef}
        placeholder={props.placeholder}
        disabled={props.disabled}
        className={props.className}
        id={props.id}
        style={props.style}
        type={props.type ?? 'text'}
        onChange={props.onChange}
        defaultValue={props.defaultValue}
        value={props.value || ''}
        error={props.error}
        onKeyDown={props.onKeyDown}
        icon={!!props.icon}
        onFocus={e => {
          setActive(true);
          props.onFocus?.(e);
        }}
        onBlur={() => setActive(false)}
      />
    </InputContainer>
  );
};

export default InputField;

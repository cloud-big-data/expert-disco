import styled from 'styled-components/macro';
import React, { useState } from 'react';
import Styles from 'styles/Styles';
import { AutoComplete } from 'antd';
import { Label } from './Typography';

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
      ? `2px solid ${Styles.red400}`
      : `2px solid ${Styles.faintBorderColor}`};
  ${props =>
    props.active && !props.error
      ? `
    border: 2px solid ${Styles.purple400};
  `
      : ''}
  border-radius: .625rem;

  &:hover {
    ${props =>
      props.active || props.error
        ? ``
        : `
      border: 2px solid rgba(0,0,0,.1);
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
            color: ${props.error ? Styles.red400 : Styles.purple400};
          `
          : ''}
    }
  }
`;

const Input = styled.input<{
  error?: boolean;
  icon?: boolean;
  unsetHeight?: boolean;
}>`
  width: 100%;
  border-radius: 0.625rem;
  height: ${props => (props.unsetHeight ? 'unset' : '3rem')};
  ${props =>
    props.unsetHeight
      ? `
    font-size: 14px;
  `
      : ''}
  border: none;
  color: ${Styles.dark400};
  padding: ${props => (props.icon ? '0.5rem .75rem .5rem 0' : '.5rem .75rem')};
  outline: none;
  transition-duration: 0.1s;

  &:disabled {
    background: rgba(239, 239, 239, 0.3);
  }
`;

const ErrorField = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  * {
    color: ${Styles.red400};
  }
  i {
    margin-right: 0.5rem;
  }
`;

const TextContainer = styled.div<{ pre?: boolean }>`
  color: ${Styles.dark400};
  display: flex;
  align-items: center;
  font-weight: bold;
  white-space: nowrap;
  padding: 0 0.75rem;
  ${props => (props.pre ? `padding-right: 0;` : '')}

  ${props =>
    props.pre
      ? `
    &:after {
      content: '';
      border: 1px solid ${Styles.faintBorderColor};
      height: 75%;
      margin-left: .75rem;
    }
  `
      : `
    &:before {
      content: '';
      border: 1px solid ${Styles.faintBorderColor};
      height: 75%;
      margin-right: .75rem;
    }
      `}
`;

const OnConfirmContainer = styled.button<{ active: boolean }>`
  background: ${Styles.defaultBgColor};
  border: none;
  border-left: 2px solid ${Styles.faintBorderColor};
  border-radius: 0 ${Styles.defaultBorderRadius} ${Styles.defaultBorderRadius} 0;
  padding: 0 1rem;
  outline: none;
`;

const InputField: React.FC<{
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  setValue?: (value: string) => void;
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
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
  role?: string;
  unsetHeight?: boolean;
  validationError?: string;
  append?: string;
  prepend?: string;
  label?: string;
  name?: string;
  onConfirm?: () => void;
  confirmText?: string;
  min?: number;
  max?: number;
  options?: Array<{ label?: string; value: string }>;
  dropdownOpen?: boolean;
  spellCheck?: boolean;
}> = props => {
  const [active, setActive] = useState(false);

  const inputField = (
    <Input
      unsetHeight={props.unsetHeight}
      name={props.name ?? props.label}
      ref={props.inputRef}
      placeholder={props.placeholder}
      disabled={props.disabled}
      className={props.className}
      style={props.style}
      type={props.type ?? 'text'}
      onChange={props.onChange}
      defaultValue={props.defaultValue}
      value={props.value || ''}
      error={props.error}
      onKeyDown={props.onKeyDown}
      spellCheck={props.spellCheck ?? true}
      icon={!!props.icon}
      onFocus={e => {
        setActive(true);
        props.onFocus?.(e);
      }}
      onBlur={e => {
        setActive(false);
        props.onBlur?.(e);
      }}
      role={props.role}
      min={props.min}
      max={props.max}
    />
  );

  return (
    <>
      {props.label && (
        <Label unBold htmlFor={props.name ?? props.label}>
          {props.label}
        </Label>
      )}
      {props.validationError && (
        <ErrorField>
          <i className="fal fa-times-circle" />
          <span>{props.validationError}</span>
        </ErrorField>
      )}
      <InputContainer
        id={props.id}
        disabled={props.disabled}
        active={active}
        error={!!props.error || !!props.validationError}
      >
        {props.icon && <div className="icon__container">{props.icon}</div>}
        {props.prepend && <TextContainer pre>{props.prepend}</TextContainer>}
        {props.options ? (
          <AutoComplete
            value={typeof props.value === 'string' ? props.value : ''}
            open={props.dropdownOpen}
            options={props.options}
            style={{ width: '100%', border: 'none' }}
            onSelect={props.setValue}
          >
            {inputField}
          </AutoComplete>
        ) : (
          inputField
        )}
        {props.append && <TextContainer>{props.append}</TextContainer>}
        {props.onConfirm && (
          <OnConfirmContainer active={active} onClick={props.onConfirm}>
            {props.confirmText ?? 'Submit'}
          </OnConfirmContainer>
        )}
      </InputContainer>
    </>
  );
};

export default InputField;

import React from "react";
import styled from "styled-components/macro";
import Styles from "styles/Styles";

const Input = styled.input<{ error?: boolean }>`
  border-radius: 0.625rem;
  border: ${props => props.error ? `1px solid ${Styles.red}` : '1px solid rgba(0, 0, 0, 0.2)'};
  height: 3rem;
  color: ${Styles.fontColor};
  padding: 0.5rem;
  outline: none;
  transition-duration: 0.2s;
  &:hover {
    box-shadow: ${Styles.smBoxShadow};
  }
  &:active,
  &:focus {
    border: 1px solid ${Styles.purple};
  }
`;

const InputField: React.FC<{
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  style?: {
    [key: string]: string | number;
  };
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  type?: string;
  error?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}> = (props) => {
  return (
    <Input
      placeholder={props.placeholder}
      className={props.className}
      id={props.id}
      style={props.style}
      type={props.type ?? 'text'}
      onChange={props.onChange}
      defaultValue={props.defaultValue}
      value={props.value || ""}
      error={props.error}
      onKeyDown={props.onKeyDown}
    />
  );
};

export default InputField;

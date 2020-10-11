import React from "react";
import styled from "styled-components/macro";
import Styles from "styles/Styles";

const Input = styled.input`
  border-radius: 0.625rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
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
}> = (props) => {
  return (
    <Input
      placeholder={props.placeholder}
      className={props.className}
      id={props.id}
      style={props.style}
      onChange={props.onChange}
      defaultValue={props.defaultValue}
      value={props.value || ""}
    />
  );
};

export default InputField;

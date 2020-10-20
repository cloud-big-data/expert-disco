import React, { useState } from "react";
import styled from "styled-components/macro";
import Styles from "styles/Styles";

const InputContainer = styled.div<{
  error: boolean;
  active: boolean;
}>`
  display: flex;
  width: 100%;
  border: ${props => props.error ? `1px solid ${Styles.red}` : '1px solid rgba(0, 0, 0, 0.1)'};
  ${props => props.active ? `
    border: 1px solid ${Styles.purple};
  ` : ''}
  border-radius: .625rem;

  &:hover {
    border: 1px solid ${Styles.purple};
    i {
      color: ${Styles.purple};
    }
  }
  .icon__container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3rem;
    i {
      font-size: 1.5rem;
      ${props => props.active ? `
        color: ${Styles.purple};
      ` : ''}
    }
  }
`;

const Input = styled.input<{
  error?: boolean;
  icon?: boolean;
}>`
  border-radius: 0.625rem;
  height: 3rem;
  border: none;
  color: ${Styles.fontColor};
  padding: ${props => props.icon ? '0.5rem .75rem .5rem 0' : '.5rem .75rem'};
  outline: none;
  transition-duration: 0.2s;
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
}> = (props) => {
  const [active, setActive] = useState(false);

  return (
    <InputContainer active={active} error={!!props.error}>
      {props.icon && (
        <div className="icon__container">
          {props.icon}
        </div>
      )}
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
        icon={!!props.icon}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      />
    </InputContainer>
  );
};

export default InputField;

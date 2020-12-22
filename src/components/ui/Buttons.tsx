import styled from 'styled-components/macro';
import React from 'react';
import Styles from 'styles/Styles';

interface IButton {
  id?: string;
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  icon?: boolean;
}

const Button = styled.button<{
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  disabled?: boolean;
  danger?: boolean;
  icon?: boolean;
}>`
  border-radius: .4rem;
  font-size: 1rem;
  padding: 0.75em 2.5em;
  text-align: center;
  font-weight: 700;
  transition-duration: 0.5s;
  outline: none;
  text-decoration: none;
  margin: 0.25em 0;
  cursor: pointer;
  border: 2px solid ${Styles.faintBorderColor};

  &:disabled {
    pointer-events: none;
    cursor: not-allowed;
    &:hover {
      opacity: 0.5;
    }
  }

  ${props =>
    props.primary
      ? `
    background: linear-gradient(115.8deg, #6e30f2 0%, #86e2ff 100%);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
    background-repeat: no-repeat;
    color: white;
    border: none;

    &:hover {
      opacity: 0.7;
    }

    &:disabled {
      opacity: .5;
    }
  `
      : ''}

  ${props =>
    props.secondary
      ? `
    background: transparent;
    border-color: ${Styles.fontColor};
    color: ${Styles.fontColor};

    &:hover {
      background: linear-gradient(115.8deg, #6e30f2 0%, #86e2ff 100%);
      border-color: ${Styles.blue};
      color: white;
    }

    &:disabled {
      border-color: #919191;
      color: #919191;
      background: transparent;
    }
  `
      : ''}

  ${props =>
    props.tertiary
      ? `
      border-color: transparent;
      color: ${Styles.fontColor};
      background: transparent;

      &:hover {
        color: ${Styles.purple};
        * {
          color: ${Styles.purple};
        }
      }

      &:disabled {
        color: #919191;
      }
  `
      : ''}

  ${props =>
    props.danger
      ? `
    border-color: ${Styles.red};
    background: transparent;
    &:hover {
      background-color: #fa9596;
    }
  `
      : ''}

  ${props =>
    props.icon
      ? `
      display: flex;
      align-items: center;
      padding: .25rem;
      height: 1rem;
      border: none;
      background: transparent;

      &:hover {
        i {
          color: ${Styles.purple};
        }
      }
    `
      : ''}
`;

const ButtonPrimary: React.FC<IButton> = props => (
  <Button
    disabled={props.disabled ? props.disabled : false}
    onClick={props.onClick && props.onClick}
    id={props.id}
    primary
    style={props.style}
    className={props.className}
  >
    {props.children}
  </Button>
);

const ButtonSecondary: React.FC<IButton> = props => (
  <Button
    disabled={props.disabled}
    onClick={props.onClick && props.onClick}
    id={props.id}
    secondary
    style={props.style}
    className={props.className}
  >
    {props.children}
  </Button>
);

const ButtonTertiary: React.FC<IButton> = props => (
  <Button
    disabled={props.disabled}
    onClick={props.onClick && props.onClick}
    id={props.id}
    tertiary
    style={props.style}
    className={props.className}
  >
    {props.children}
  </Button>
);

const ButtonDanger: React.FC<IButton> = props => (
  <Button
    disabled={props.disabled}
    onClick={props.onClick && props.onClick}
    id={props.id}
    danger
    style={props.style}
    className={props.className}
  >
    {props.children}
  </Button>
);

const IconButton: React.FC<IButton> = props => (
  <Button
    disabled={props.disabled}
    onClick={props.onClick && props.onClick}
    id={props.id}
    icon
    style={props.style}
    className={props.className}
  >
    {props.children}
  </Button>
);

export { ButtonPrimary, ButtonTertiary, ButtonSecondary, ButtonDanger, IconButton };

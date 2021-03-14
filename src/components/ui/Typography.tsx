import styled from 'styled-components/macro';
import React from 'react';
import Styles from 'styles/Styles';

interface IText {
  id?: string;
  size: 'sm' | 'lg';
  len: 'long' | 'short';
  style?: React.CSSProperties;
}

const TextContainer = styled.p<{
  size: string;
  len: string;
  danger?: boolean;
}>`
  ${props => (props.danger ? `color: ${Styles.red400} !important;` : '')}
  ${props =>
    props.size === 'sm' && props.len === 'short'
      ? `
      font-size: 0.875rem;
      letter-spacing: 0.16px;
      line-height: 1.125rem;
    `
      : ''}
  ${props =>
    props.size === 'sm' && props.len === 'long'
      ? `
      font-size: 0.875rem;
      letter-spacing: 0.16px;
      line-height: 1.25rem;
    `
      : ''}
  ${props =>
    props.size === 'lg' && props.len === 'short'
      ? `
      font-size: 1rem;
      letter-spacing: 0.16px;
      line-height: 1.375rem;
    `
      : ''}
  ${props =>
    props.size === 'lg' && props.len === 'long'
      ? `
      font-size: 1rem;
      letter-spacing: 0.16px;
      line-height: 1.5rem;
    `
      : ''}

`;

const Text: React.FC<IText> = props => (
  <TextContainer style={props.style} id={props.id} size={props.size} len={props.len}>
    {props.children}
  </TextContainer>
);

const DangerText: React.FC<IText> = props => (
  <TextContainer
    danger
    style={props.style}
    id={props.id}
    size={props.size}
    len={props.len}
  >
    {props.children}
  </TextContainer>
);

const LabelContainer = styled.label<{
  unBold?: boolean;
  hoverBold?: boolean;
  hoverPurple?: boolean;
}>`
  display: flex;
  font-weight: ${props => (props.unBold ? 500 : 600)};
  color: ${Styles.dark400};
  margin: 0.5rem 0;
  ${props =>
    props.hoverBold
      ? `
    &:hover {
      font-weight: 700;
    }
  `
      : ``}

  ${props =>
    props.hoverPurple
      ? `
    &:hover {
      color: ${Styles.purple400};
    }
  `
      : ''}
`;

const Label: React.FC<{
  id?: string;
  style?: React.CSSProperties;
  unBold?: boolean;
  hoverBold?: boolean;
  hoverPurple?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
  onClick?: () => void;
}> = props => (
  <LabelContainer
    hoverPurple={props.hoverPurple}
    hoverBold={props.hoverBold}
    unBold={props.unBold}
    id={props.id}
    htmlFor={props.htmlFor}
    style={props.style}
    onClick={props.onClick}
  >
    {props.children}
  </LabelContainer>
);

const HelperContainer = styled.p`
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 400;
  letter-spacing: 0.32px;
`;

const Helper: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ style, children }) => (
  <HelperContainer style={style}>{children}</HelperContainer>
);

const PillColor: {
  [key in 'green' | 'red' | 'softGray']: string;
} = {
  green: Styles.green,
  red: Styles.red400,
  softGray: Styles.softGray,
};

const Pill = styled.p<{ color?: 'green' | 'red' | 'softGray' }>`
  display: block;
  width: auto;
  border-radius: ${Styles.defaultBorderRadius};
  padding: 0.5rem;
  background: ${props => PillColor[props.color ?? 'red']};
`;

const TertiaryLabel = styled.p`
  color: ${Styles.softGray} !important;
  font-weight: 700;
`;

export { Text, Helper, DangerText, Label, Pill, TertiaryLabel };

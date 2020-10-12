import React from "react";
import styled from 'styled-components/macro';
import Styles from "styles/Styles";

interface text {
  id?: string;
  size: string;
  len: string;
  style?: {
    [key: string]: number | string;
  };
}

const TextContainer = styled.p<{
  size: string;
  len: string;
  danger?: boolean;
}>`
  ${props =>
    props.danger ? `color: ${Styles.red};` : ''
  }
  ${props => 
    props.size === "sm" && props.len === "short" ? `
      font-size: 0.875rem;
      letter-spacing: 0.16px;
      line-height: 1.125rem;
    ` : '' 
  }
  ${props =>
    props.size === "sm" && props.len === "long" ? `
      font-size: 0.875rem;
      letter-spacing: 0.16px;
      line-height: 1.25rem;
    ` : ''
  }
  ${props =>
    props.size === "lg" && props.len === "short" ? `
      font-size: 1rem;
      letter-spacing: 0.16px;
      line-height: 1.375rem;
    ` : ''
  }
  ${props =>
    props.size === "lg" && props.len === "long" ? `
      font-size: 1rem;
      letter-spacing: 0.16px;
      line-height: 1.5rem;
    ` : ''
  }

`;

const Text: React.FC<text> = (props) => {
  return (
    <TextContainer id={props.id} size={props.size} len={props.len}>
      {props.children}
    </TextContainer>
  );
};

const DangerText: React.FC<text> = props => {
  return (
    <TextContainer danger id={props.id} size={props.size} len={props.len}>
      {props.children}
    </TextContainer>
  )
}

const HelperContainer = styled.p`
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 400;
  letter-spacing: 0.32px;
`;

const Helper: React.FC<{ children: React.ReactNode }> = (props) => {
  return <HelperContainer>{props.children}</HelperContainer>;
};

export { Text, Helper, DangerText };
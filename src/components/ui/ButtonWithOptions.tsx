import DropdownMenu from 'components/DropdownMenu';
import { DropdownMenuOptions } from 'components/DropdownMenu/DropdownMenu';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const Container = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1rem;
  outline: none;
  text-align: center;
  justify-content: center;
  background: ${Styles.purpleGradient};
  color: white;
  border-radius: ${Styles.defaultBorderRadius};
  padding: 0.75em 0 0.75em 2.5em;
  font-weight: 700;
  border: none;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  transition-duration: 0.2s;
  border: 1px solid ${Styles.faintBorderColor};

  .dropdown__container {
    color: ${Styles.dark400};
    margin-bottom: -3rem;
    right: 2rem;
  }
`;

const DropdownTrigger = styled.div`
  cursor: pointer;
  display: flex;
  flex: 1 0 auto;
  margin-left: auto;
  justify-content: center;
  width: 3rem;
  i {
    color: white;
  }
`;

const ButtonWithOptions: React.FC<{
  options: DropdownMenuOptions;
  pos?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
}> = ({ children, options, pos }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  return (
    <Container onClick={toggleOpen}>
      {children}
      <DropdownTrigger
        onClick={e => {
          e.stopPropagation();
          toggleOpen();
        }}
      >
        {isOpen ? (
          <i className="fas fa-caret-down" />
        ) : (
          <i className="fal fa-caret-down" />
        )}
      </DropdownTrigger>
      <div className="dropdown__container">
        {isOpen && (
          <DropdownMenu
            pos={pos}
            closeMenu={() => setIsOpen(false)}
            options={options}
          />
        )}
      </div>
    </Container>
  );
};

export default ButtonWithOptions;

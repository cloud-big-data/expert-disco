import { Label } from 'components/ui/Typography';
import useHandleClickOutside from 'hooks/useHandleClickOutside';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import FadeIn from 'react-fade-in';

const RightClickMenuContainer = styled.div<{
  pos?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
}>`
  cursor: pointer;
  position: absolute;
  border: 1px solid ${Styles.faintBorderColor};
  background: white;
  border-radius: .3rem;
  box-shadow: ${Styles.smBoxShadow};
  padding: ${Styles.defaultPadding};
  max-width: 20rem;
  min-width: 12rem;
  margin-left: 0.25rem;
  z-index: 200;
  ${props => (props.pos?.top ? `top: ${props.pos?.top}rem;` : '')}
  ${props => (props.pos?.right ? `right: ${props.pos?.right}rem;` : '')}
  ${props => (props.pos?.bottom ? `bottom: ${props.pos?.bottom}rem;` : '')}
  ${props => (props.pos?.left ? `left: ${props.pos?.left}rem;` : '')}

  .options__container {
    position: relative;
    display: flex;
    flex-direction: column;
  }
`;

const MenuOption = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  text-align: left;
  transition: all 0.3s ease-in-out;

  &:hover {
    color: red;
  }

  .icon__container {
    margin-right: 0.5rem;
    width: 1rem;
    height: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export type DropdownMenuOptions = Array<{
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}>;

const DropdownMenu: React.FC<{
  closeMenu: () => void;
  options: DropdownMenuOptions;
  pos?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
}> = ({ closeMenu, options, pos }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  useHandleClickOutside(menuRef, closeMenu);

  // handles closing the context menu if you target the context menu on another node
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [closeMenu]);

  return (
    <RightClickMenuContainer
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
      }}
      className="push-to-front"
      pos={pos}
      ref={menuRef}
    >
      <div className="options__container">
        <FadeIn>
          {options.map(opt => (
            <MenuOption
              key={opt.label}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                opt.onClick();
              }}
            >
              <div className="icon__container">{opt.icon}</div>
              <Label style={{ margin: 0, fontSize: '14px' }} hoverPurple unBold>
                {opt.label}
              </Label>
            </MenuOption>
          ))}
        </FadeIn>
      </div>
    </RightClickMenuContainer>
  );
};

export default DropdownMenu;

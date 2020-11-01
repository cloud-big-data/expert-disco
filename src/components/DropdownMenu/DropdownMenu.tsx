import { Label } from 'components/ui/Typography';
import useHandleClickOutside from 'hooks/useHandleClickOutside';
import usePushToFront from 'hooks/usePushToFront';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const RightClickMenuContainer = styled.div<{
  pos?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
}>`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: absolute;
  border: 1px solid ${Styles.faintBorderColor};
  background: white;
  border-radius: ${Styles.defaultBorderRadius};
  box-shadow: ${Styles.smBoxShadow};
  padding: ${Styles.defaultPadding};
  margin-bottom: -8rem;
  max-width: 20rem;
  min-width: 12rem;
  margin-left: 0.25rem;
  z-index: 200;
  ${props => (props.pos?.top ? `top: ${props.pos?.top}rem;` : '')}
  ${props => (props.pos?.right ? `right: ${props.pos?.right}rem;` : '')}
  ${props => (props.pos?.bottom ? `bottom: ${props.pos?.bottom}rem;` : '')}
  ${props => (props.pos?.left ? `left: ${props.pos?.left}rem;` : '')}
`;

const MenuOption = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  text-align: left;

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
  usePushToFront();

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
    <RightClickMenuContainer pos={pos} ref={menuRef}>
      {options.map(opt => (
        <MenuOption
          key={opt.label}
          onClick={() => {
            closeMenu();
            opt.onClick();
          }}
        >
          <div className="icon__container">{opt.icon}</div>
          <Label hoverBold unBold>
            {opt.label}
          </Label>
        </MenuOption>
      ))}
    </RightClickMenuContainer>
  );
};

export default DropdownMenu;

import { Label } from 'components/ui/Typography';
import useHandleClickOutside from 'hooks/useHandleClickOutside';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const RightClickMenuContainer = styled.div`
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
  max-width: 15rem;
  min-width: 12rem;
  margin-left: 0.25rem;
  z-index: 200;
`;

const MenuOption = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: 0.3rem;

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

const DropdownMenu: React.FC<{
  closeMenu: () => void;
  options: Array<{
    label: string;
    onClick: () => void;
    icon: React.ReactNode;
  }>;
}> = ({ closeMenu, options }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  useHandleClickOutside(menuRef, closeMenu);

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
    <RightClickMenuContainer ref={menuRef}>
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

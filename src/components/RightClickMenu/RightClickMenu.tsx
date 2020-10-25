import { Label } from 'components/ui/Typography';
import useHandleClickOutside from 'hooks/useHandleClickOutside';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const RightClickMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  border: 1px solid ${Styles.faintBorderColor};
  background: white;
  border-radius: ${Styles.defaultBorderRadius};
  box-shadow: ${Styles.smBoxShadow};
  padding: ${Styles.defaultPadding};
  margin-bottom: -5rem;
  max-width: 15rem;
`;

const MenuOption = styled.div`
  display: flex;
  align-items: center;

  .icon__container {
    margin-right: 0.5rem;
  }
`;

const RightClickMenu: React.FC<{
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
          <Label unBold>{opt.label}</Label>
        </MenuOption>
      ))}
    </RightClickMenuContainer>
  );
};

export default RightClickMenu;

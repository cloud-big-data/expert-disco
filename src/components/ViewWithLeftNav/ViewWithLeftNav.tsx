import Select from 'components/ui/Select';
import useWindowSize from 'hooks/useWindowSize';
import React from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import { Badge } from 'antd';

interface IViewWithLeftNav {
  options: Array<{
    value: string;
    name: string;
    icon: React.ReactNode;
    count?: number;
  }>;
  activeView: string;
  children: React.ReactNode;
  setView: (view: string) => void;
  cancelPadding?: boolean;
}

const Container = styled.div<{
  stackNav: boolean;
  cancelPadding?: boolean;
}>`
  display: grid;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  grid-template-columns: 1fr 3fr;
  width: 100%;
  @media (max-width: ${Styles.defaultMaxWidth}) {
    ${props =>
      !props.cancelPadding
        ? `
          padding: ${Styles.defaultPadding};
        `
        : ''}
  }

  @media (max-width: 900px) {
    grid-template-columns: 4fr;
  }
`;

const LeftNav = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  .icon__container {
    margin-right: 1rem;
    width: 1rem;
    display: flex;
    justify-content: center;
  }
`;

const NavItem = styled.div<{ active?: boolean }>`
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  i {
    color: ${props => (props.active ? Styles.purple400 : 'inherit')};
  }
  .label__container {
    transition-duration: 0.2s;
    ${props =>
      props.active
        ? `
        transform: scale(1.1);
        padding-left: .3rem;
      `
        : ''}
  }
  margin-top: 1rem;
  display: flex;
  flex: 0 1 auto;
  cursor: pointer;
  align-items: center;
  &:hover {
    font-weight: bold;
  }
`;

const MainContainer = styled.div`
  display: flex;
`;

const ViewWithLeftNav: React.FC<IViewWithLeftNav> = ({
  options,
  children,
  activeView,
  setView,
  cancelPadding,
}) => {
  const { width } = useWindowSize();
  const stackNav = width !== undefined && width < 900;

  return (
    <Container cancelPadding={cancelPadding} stackNav={stackNav}>
      {stackNav ? (
        <Select value={activeView} options={options} onChange={setView} />
      ) : (
        <LeftNav>
          {options.map(option => (
            <NavItem
              onClick={() => setView(option.value)}
              active={activeView === option.value}
              key={option.value}
            >
              <div className="icon__container">{option.icon}</div>
              <div className="label__container">
                <Badge offset={[15, 0]} count={option.count}>
                  {option.name}
                </Badge>
              </div>
            </NavItem>
          ))}
        </LeftNav>
      )}
      <MainContainer>{children}</MainContainer>
    </Container>
  );
};

export default ViewWithLeftNav;

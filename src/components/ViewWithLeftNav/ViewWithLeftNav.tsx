import useWindowSize from 'hooks/useWindowSize';
import React from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import Select from 'react-select';

interface IViewWithLeftNav {
  options: Array<{
    label: string;
    value: string;
    icon: React.ReactNode;
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

  @media (max-width: 750px) {
    grid-template-columns: 4fr;
  }
`;

const LeftNav = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  .icon__container {
    margin-right: 1rem;
  }
`;

const NavItem = styled.div<{ active?: boolean }>`
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  i {
    color: ${props => (props.active ? Styles.purple : 'inherit')};
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
  transition-duration: 0.3s;
  &:hover {
    font-weight: bold;
  }

  &:nth-of-type(2) {
    i {
      color: ${Styles.green};
    }
  }
  &:nth-of-type(3) {
    i {
      color: ${Styles.blue};
    }
  }
  &:nth-of-type(4) {
    i {
      color: ${Styles.peach};
    }
  }
  &:nth-of-type(5) {
    i {
      color: ${Styles.yellow};
    }
  }
  &:nth-of-type(6) {
    i {
      color: ${Styles.red};
    }
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
  const stackNav = width !== undefined && width < 750;

  return (
    <Container cancelPadding={cancelPadding} stackNav={stackNav}>
      {stackNav ? (
        <Select options={options} onChange={(e: any) => setView(e.value)} />
      ) : (
        <LeftNav>
          {options.map(option => (
            <NavItem
              onClick={() => setView(option.value)}
              active={activeView === option.value}
              key={option.value}
            >
              <div className="icon__container">{option.icon}</div>
              <div className="label__container">{option.label}</div>
            </NavItem>
          ))}
        </LeftNav>
      )}
      <MainContainer>{children}</MainContainer>
    </Container>
  );
};

export default ViewWithLeftNav;

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
  }>
  activeView: string;
  children: React.ReactNode;
  setView: (view: string) => void;
}

const Container = styled.div<{ stackNav: boolean }>`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  width: 100%;
  padding: ${Styles.defaultPadding};

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
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  color: ${props => props.active ? Styles.purple : 'inherit'};
  i {
    color: ${props => props.active ? Styles.purple : 'inherit'};
  }
  margin-top: 1rem;
  display: flex;
  flex: 1 1 auto;
  cursor: pointer;
  transition-duration: .3s;
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
}) => {
  const { width } = useWindowSize();
  const stackNav = width !== undefined && width < 750;

  return (
    <Container stackNav={stackNav}>
      {stackNav ? (
        <Select
          options={options}
          onChange={(e: any) =>
            setView(e.value)
          }
        />
      ) : (
        <LeftNav>
          {options.map(option =>
            <NavItem onClick={() => setView(option.value)} active={activeView === option.value} key={option.value}>
              <div className="icon__container">
                {option.icon}
              </div>
              <div className="label__container">
                {option.label}
              </div>
            </NavItem>  
          )}
        </LeftNav>
      )}
      <MainContainer>
        { children }
      </MainContainer>
    </Container>
  )
}

export default ViewWithLeftNav;
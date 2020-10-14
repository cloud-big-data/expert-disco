import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const CustomerNavContainer = styled.div`
  display: flex;
  position: sticky;
  padding: ${Styles.defaultPadding};

  .customer-nav__icon {
    font-size: 1.25rem;
    font-weight: bold;
  }
`;

const UserDropdownContainer = styled.div<{ dropdownOpen: boolean }>`
  display: flex;
  margin-left: auto;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 2px solid ${Styles.fontColor};
  padding: .25rem;
  border-radius: 50%;
  cursor: pointer;

  ${props => props.dropdownOpen ? `box-shadow: ${Styles.boxShadow};` : ''}
  &:hover {
    box-shadow: ${Styles.boxShadow};
  }
`;

const UserDropdownExpanded = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  margin-top: 6rem;
  margin-left: -8rem;
  background: white;
  padding: 1rem;
  width: 10rem;
  text-align: center;
  box-shadow: ${Styles.smBoxShadow};
  border-radius: .5rem;
  a {
    text-decoration: none;

    &:hover {
      font-weight: bold;
    }
  }
`;

const CustomerNav: React.FC = () => {
  const [dropdownOpen, toggleDropdownOpen] = useState(false);
  
  return (
    <CustomerNavContainer>
      <Link style={{textDecoration: 'none'}} to="/home">
        <span className="customer-nav__icon">Skyvue.io</span>
      </Link>
      <UserDropdownContainer onClick={() => toggleDropdownOpen(!dropdownOpen)} dropdownOpen={dropdownOpen}>
        <i className="fad fa-user" />
        {dropdownOpen && (
          <UserDropdownExpanded>
            <Link to="/logout">Logout</Link>
          </UserDropdownExpanded>
        )}
      </UserDropdownContainer>
    </CustomerNavContainer>
  )
}

export default CustomerNav;
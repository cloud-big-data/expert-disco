import Separator from 'components/Separator';
import React from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const Container = styled.div`
  display: flex;
  background: ${Styles.warning100};
  border: 2px solid ${Styles.warning200};
  padding: 0.5rem;
  align-items: center;
  border-radius: ${Styles.defaultBorderRadius};
  .icon__container {
    i {
      font-size: 3rem;
      color: rgba(88, 65, 20, 0.3);
    }
    margin-right: 1rem;
  }
  .content__container {
    width: 100%;
    text-align: center;
  }
`;

const WarningBlock: React.FC<{ actions?: React.ReactNode }> = ({
  children,
  actions,
}) => (
  <Container>
    <div className="icon__container">
      <i className="fad fa-info-square" />
    </div>
    <div className="content__container">
      {children}{' '}
      {actions && (
        <>
          <Separator />
          {actions}
        </>
      )}
    </div>
  </Container>
);

export default WarningBlock;

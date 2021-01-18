import { IFilterLayer, LogicalOperators } from 'app/dataset/types';
import { ButtonDanger, ButtonTertiary, IconButton } from 'components/ui/Buttons';
import Select from 'components/ui/Select';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import * as R from 'ramda';
import { Text } from 'components/ui/Typography';

const OperatorContainer = styled.div<{ first?: boolean }>`
  display: flex;
  align-items: center;
  ${props =>
    !props.first
      ? `
    margin-top: 2rem;
  `
      : ``}
`;

const DeleteConfirmationContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 50%;
  .buttons {
    display: flex;
    align-items: center;
    button:last-of-type {
      margin-left: 1rem;
    }
  }
`;

const Operator: React.FC<{
  state: LogicalOperators;
  setFiltersState: (filterState: IFilterLayer) => void;
  parentFilterState: IFilterLayer;
  index: number;
  incrementIndentation: (index: number) => void;
  parent?: boolean;
  path: number[];
}> = ({ path, parentFilterState, parent, state, setFiltersState }) => {
  const [showDeleteConf, setShowDeleteConf] = useState(false);

  return (
    <OperatorContainer first={parent}>
      {showDeleteConf ? (
        <DeleteConfirmationContainer>
          <h6 style={{ marginBottom: 0 }}>
            Are you sure you want to delete this rule?
          </h6>
          <Text size="lg" len="short">
            This will delete all of the rules nested beneath it. This action cannot
            be undone.
          </Text>
          <div className="buttons">
            <ButtonTertiary onClick={() => setShowDeleteConf(false)}>
              Cancel
            </ButtonTertiary>
            <ButtonDanger
              onClick={() => {
                setFiltersState(
                  parent
                    ? []
                    : R.dissocPath(
                        path.slice(0, path.length - 1),
                        parentFilterState,
                      ),
                );
              }}
            >
              Confirm
            </ButtonDanger>
          </div>
        </DeleteConfirmationContainer>
      ) : (
        <>
          <IconButton onClick={() => setShowDeleteConf(true)}>
            <i
              style={{ color: Styles.red400, marginRight: '.5rem' }}
              className="far fa-times-circle"
            />
          </IconButton>
          <Select
            onChange={value =>
              setFiltersState(R.assocPath(path, value, parentFilterState))
            }
            options={[
              { name: 'and', value: 'AND' },
              { name: 'or', value: 'OR' },
            ]}
            placeholder="select and/or"
            value={state}
          />
        </>
      )}
    </OperatorContainer>
  );
};

export default Operator;

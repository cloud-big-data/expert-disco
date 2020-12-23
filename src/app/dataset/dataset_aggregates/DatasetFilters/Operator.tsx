import { IFilterLayer, LogicalOperators } from 'app/dataset/types';
import { ButtonDanger, ButtonTertiary, IconButton } from 'components/ui/Buttons';
import Select from 'components/ui/Select';
import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import { v4 as uuidv4 } from 'uuid';
import * as R from 'ramda';
import DatasetContext from 'contexts/DatasetContext';
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
  const { boardData } = useContext(DatasetContext)!;
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
                  R.dissocPath(path.slice(0, path.length - 1), parentFilterState),
                );
              }}
            >
              Confirm
            </ButtonDanger>
          </div>
        </DeleteConfirmationContainer>
      ) : (
        <>
          {!parent && (
            <IconButton onClick={() => setShowDeleteConf(true)}>
              <i
                style={{ color: Styles.red400, marginRight: '.5rem' }}
                className="far fa-times"
              />
            </IconButton>
          )}
          <Select
            fill={Styles.blue}
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
          <IconButton
            onClick={() => {
              setFiltersState(
                R.over(
                  R.lensPath(path.slice(0, path.length - 1)),
                  R.append({
                    filterId: uuidv4(),
                    key: boardData.columns[0]._id,
                    predicateType: 'equals',
                    value: '',
                  }),
                  parentFilterState,
                ),
              );
            }}
          >
            <i
              style={{ color: Styles.green, marginLeft: '.5rem' }}
              className="fas fa-plus-square"
            />
          </IconButton>
        </>
      )}
    </OperatorContainer>
  );
};

export default Operator;

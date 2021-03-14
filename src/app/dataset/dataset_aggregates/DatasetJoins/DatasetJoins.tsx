import { Empty, Switch } from 'antd';
import { IJoinLayer } from 'app/dataset/types';
import Separator from 'components/Separator';
import { ButtonPrimary } from 'components/ui/Buttons';
import { Label } from 'components/ui/Typography';
import DatasetContext from 'contexts/DatasetContext';
import React, { FC, useContext, useState } from 'react';

import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import JoinEditor from './JoinEditor';

const JoinsContainer = styled.div`
  .top__container {
    display: flex;
    justify-content: space-between;
  }
  .toggle__container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .title {
    display: flex;
    align-items: center;
  }
  .icon__container {
    width: 3rem;
    height: 3rem;
    display: flex;
    background: ${Styles.purple100};
    border: 1px solid ${Styles.purple200};
    padding: 1rem;
    border-radius: 50%;
    align-items: center;
    justify-content: center;

    #share_icon {
      color: ${Styles.purple400};
      font-size: 1rem;
    }
  }
`;

const DatasetJoins: FC = () => {
  const { boardData, setBoardData, socket, setLoading } = useContext(
    DatasetContext,
  )!;

  const [joinState, setJoinState] = useState<Partial<IJoinLayer> | undefined>(
    boardData.layers?.joins,
  );
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  return (
    <JoinsContainer>
      <div className="top__container">
        <div className="title">
          <div className="icon__container">
            <i id="share_icon" className="fad fa-code-merge" />
          </div>
          <h6 style={{ marginBottom: 0, marginLeft: '1rem' }}>
            Join this dataset with another
          </h6>
        </div>
        <div className="toggle__container">
          <Label>Apply layer</Label>
          <Switch
            onChange={e => {
              setBoardData?.({
                ...boardData,
                layerToggles: {
                  ...boardData.layerToggles,
                  joins: e,
                },
              });
              socket?.emit('toggleLayer', {
                toggle: 'joins',
                visible: e,
              });
              setLoading(true);
            }}
            checked={boardData.layerToggles.joins}
          />
        </div>
      </div>
      <Separator />
      {joinState && Object.keys(joinState ?? {}).length > 0 ? (
        <JoinEditor
          unsavedChanges={unsavedChanges}
          setUnsavedChanges={setUnsavedChanges}
          joinState={joinState}
          setJoinState={setJoinState}
        />
      ) : (
        <Empty
          description={
            <span>
              Join this dataset together with a common column on another dataset.
            </span>
          }
        >
          <ButtonPrimary
            style={{ margin: '0 auto' }}
            onClick={() =>
              setJoinState({
                ...joinState,
                joinType: 'left',
                condition: {
                  datasetId: '',
                  select: [],
                  on: [],
                },
              })
            }
          >
            Add a join
          </ButtonPrimary>
        </Empty>
      )}
    </JoinsContainer>
  );
};

export default DatasetJoins;

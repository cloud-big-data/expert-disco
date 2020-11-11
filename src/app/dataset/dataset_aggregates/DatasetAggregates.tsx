import { ButtonTertiary } from 'components/ui/Buttons';
import Card from 'components/ui/Card';
import ViewWithLeftNav from 'components/ViewWithLeftNav';
// import DatasetContext from 'contexts/DatasetContext';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import DatasetSummary from './DatasetSummary';

const ExpandWrapper = styled.div<{ expanded: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  #expand_toggle {
    margin-bottom: 1rem;
    padding: 0;
    i {
      margin-left: 1rem;
    }
  }

  padding-bottom: ${props => (props.expanded ? `3.5rem` : `1rem`)};
  border-bottom: 2px solid #e1e1e1;

  .contracted_buttons {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, auto);
    button {
      align-self: center;
      justify-self: center;
      align-items: center;
      text-align: left;
      padding: 0;
      display: flex;
      i {
        margin-right: 1rem;
      }
    }
  }
`;

const AggregatesContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 3fr 1fr;
  grid-column-gap: 1rem;

  h6 {
    margin: 0 0 1rem;
  }
`;

const ChangeHistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

const VIEWS = [
  {
    label: 'Dataset summary',
    value: 'summary',
    icon: <i className="fad fa-scroll" />,
  },
  {
    label: 'Group this dataset',
    value: 'group',
    icon: <i className="fad fa-layer-group" />,
  },
  // {
  //   label: 'Make pivot-able',
  //   value: 'pivotable',
  //   icon: <i className="fad fa-table" />,
  // },
  {
    label: 'Join with other datasets',
    value: 'join',
    icon: <i className="fad fa-code-merge" />,
  },
  {
    label: 'Share this dataset',
    value: 'share',
    icon: <i className="fad fa-share" />,
  },
  {
    label: 'Export to CSV',
    value: 'export',
    icon: <i className="fad fa-file-csv" />,
  },
];

const ViewLookup: {
  [key: string]: React.ReactNode;
} = {
  summary: <DatasetSummary />,
};

const DatasetAggregates: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeView, setActiveView] = useState('summary');
  // const { boardData } = useContext(DatasetContext)!;
  const ViewComponent = ViewLookup[activeView];
  return (
    <ExpandWrapper expanded={expanded}>
      <ButtonTertiary onClick={() => setExpanded(!expanded)} id="expand_toggle">
        Dataset actions
        {expanded ? (
          <i className="fas fa-caret-down" />
        ) : (
          <i className="fas fa-caret-right" />
        )}
      </ButtonTertiary>
      {expanded ? (
        <AggregatesContainer>
          <ViewWithLeftNav
            cancelPadding
            activeView={activeView}
            setView={setActiveView}
            options={VIEWS}
          >
            <Card>
              {/* <h6>{VIEWS.find(view => view.value === activeView)?.label ?? ''}</h6> */}
              {ViewComponent}
            </Card>
          </ViewWithLeftNav>
          <ChangeHistoryContainer>
            <Card>
              <h6>Change history</h6>
            </Card>
          </ChangeHistoryContainer>
        </AggregatesContainer>
      ) : (
        <div className="contracted_buttons">
          {VIEWS.map(view => (
            <ButtonTertiary
              onClick={() => {
                setActiveView(view.value);
                setExpanded(true);
              }}
              key={view.value}
            >
              {view.icon}
              {view.label}
            </ButtonTertiary>
          ))}
        </div>
      )}
    </ExpandWrapper>
  );
};

export default DatasetAggregates;

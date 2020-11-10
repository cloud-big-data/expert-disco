import { ButtonTertiary } from 'components/ui/Buttons';
import ViewWithLeftNav from 'components/ViewWithLeftNav';
// import DatasetContext from 'contexts/DatasetContext';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

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

const SummaryCard = styled.div`
  display: flex;
  flex: 1 0 auto;
  box-shadow: ${Styles.boxShadow};
  padding: 1rem 1.5rem;
  border-radius: ${Styles.defaultBorderRadius};
`;

const ChangeHistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

const VIEWS = [
  {
    label: 'summarize this dataset',
    value: 'summary',
    icon: <i className="fad fa-scroll" />,
  },
  {
    label: 'Group this dataset',
    value: 'group',
    icon: <i className="fad fa-layer-group" />,
  },
  {
    label: 'Make pivot-able',
    value: 'pivotable',
    icon: <i className="fad fa-table" />,
  },
  {
    label: 'Join w/ other datasets',
    value: 'join',
    icon: <i className="fad fa-code-merge" />,
  },
  {
    label: 'Share',
    value: 'share',
    icon: <i className="fad fa-share" />,
  },
  {
    label: 'Export to csv',
    value: 'export',
    icon: <i className="fad fa-file-csv" />,
  },
];

const DatasetAggregates: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeView, setActiveView] = useState('summary');
  // const { boardData } = useContext(DatasetContext)!;

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
            <SummaryCard>
              <p>Hi</p>
            </SummaryCard>
          </ViewWithLeftNav>
          <ChangeHistoryContainer>
            <SummaryCard>
              <h6>Change history</h6>
            </SummaryCard>
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

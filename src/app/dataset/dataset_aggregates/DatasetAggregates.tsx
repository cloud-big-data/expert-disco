import { ButtonTertiary } from 'components/ui/Buttons';
import Card from 'components/ui/Card';
import ViewWithLeftNav from 'components/ViewWithLeftNav';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import DatasetFilters from './DatasetFilters';
import DatasetSummary from './DatasetSummary';
import DatasetGrouping from './DatasetGrouping';
import DatasetExport from './DatasetExport';
import DatasetSmartColumns from './DatasetSmartColumns';

const ExpandWrapper = styled.div<{ expanded: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  #expand_toggle {
    margin-bottom: 1rem;
    padding: 0;
    i {
      margin-left: 0.5rem;
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
  grid-template-columns: 4fr;

  h6 {
    margin: 0 0 1rem;
  }

  @media (max-width: 1400px) {
    display: flex;
    flex-direction: column;
  }
`;

// const ChangeHistoryContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   flex: 1 0 auto;
//   @media (max-width: 1400px) {
//     margin-top: 1rem;
//   }
// `;

const VIEWS = [
  {
    name: 'Dataset',
    value: 'summary',
    icon: <i className="fad fa-scroll" />,
  },
  {
    name: 'Filters',
    value: 'filter',
    icon: <i className="far fa-filter" />,
  },
  {
    name: 'Smart columns',
    value: 'smartColumns',
    icon: <i style={{ color: Styles.dark300 }} className="fad fa-flux-capacitor" />,
  },
  {
    name: 'Grouping',
    value: 'groupings',
    icon: <i className="fad fa-layer-group" />,
  },
  {
    name: 'Share',
    value: 'share',
    icon: <i className="fad fa-share" />,
  },
  {
    name: 'Export',
    value: 'export',
    icon: <i className="fad fa-file-csv" />,
  },
];

const ViewLookup: {
  [key: string]: React.ReactNode;
} = {
  summary: <DatasetSummary />,
  filter: <DatasetFilters />,
  groupings: <DatasetGrouping />,
  export: <DatasetExport />,
  smartColumns: <DatasetSmartColumns />,
};

const DatasetAggregates: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const querystring = queryString.parse(location.search);
  const [expanded, setExpanded] = useState(true);
  const [activeView, setActiveView] = useState(
    (querystring.view as string) ?? 'summary',
  );
  const ViewComponent = ViewLookup[activeView];

  return (
    <ExpandWrapper id="test" expanded={expanded}>
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
            setView={(view: string) => {
              history.replace(`${location.pathname}?view=${view}`);
              setActiveView(view);
            }}
            options={VIEWS}
          >
            <Card>{ViewComponent}</Card>
          </ViewWithLeftNav>
          {/* <ChangeHistoryContainer>
            <Card>
              <h6>Change history</h6>
            </Card>
          </ChangeHistoryContainer> */}
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
              {view.name}
            </ButtonTertiary>
          ))}
        </div>
      )}
    </ExpandWrapper>
  );
};

export default DatasetAggregates;

import { Helper, Label, Text } from 'components/ui/Typography';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import humanizeTimeAgo from 'utils/humanizeTimeAgo';

const DatasetCardContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  height: 100%;
  flex-direction: column;
  border: 2px solid ${Styles.faintBorderColor};
  box-shadow: ${Styles.xsBoxShadow};
  border-radius: ${Styles.defaultBorderRadius};
  padding: 0.5rem;
  transition-duration: 0.2s;
  min-height: 7rem;

  &:hover {
    border-color: ${Styles.green};
  }

  .meta__bar {
    display: flex;
    .actions {
      margin-left: auto;
      cursor: pointer;
      &:hover {
        * {
          color: ${Styles.purple};
        }
      }
    }
  }
`;

const DatasetCard: React.FC<{
  datasetId: string;
  title: string;
  timestamp: string;
  description?: string;
}> = ({ datasetId, title, description, timestamp }) => (
  <Link
    className="no-hover"
    style={{ textDecoration: 'none' }}
    to={`/dataset/${datasetId}`}
  >
    <DatasetCardContainer>
      <div className="meta__bar">
        <div className="time-ago__container">
          <Helper style={{ lineHeight: 0 }}>
            Last updated: {humanizeTimeAgo(timestamp)}
          </Helper>
        </div>
        <div className="actions">
          <i className="far fa-cog" />
        </div>
      </div>
      <div className="label__container">
        <Label>{title}</Label>
      </div>
      {description && (
        <div className="description__container">
          <Text style={{ marginBottom: 0 }} size="sm" len="long">
            {description}
          </Text>
        </div>
      )}
    </DatasetCardContainer>
  </Link>
);

export default DatasetCard;

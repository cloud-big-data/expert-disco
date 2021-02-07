import DropdownMenu from 'components/DropdownMenu';
import { Helper, Label, Text } from 'components/ui/Typography';
import makeDatasetLink from 'lib/makeDatasetLink';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import humanizeTimeAgo from 'utils/humanizeTimeAgo';

const DatasetCardContainer = styled.div`
  display: flex;
  height: 100%;
  border: 2px solid ${Styles.faintBorderColor};
  box-shadow: ${Styles.xsBoxShadow};
  border-radius: ${Styles.defaultBorderRadius};
  transition-duration: 0.2s;
  min-height: 7rem;
  background: white;

  .background {
    border-radius: ${Styles.defaultBorderRadius} 0 0 ${Styles.defaultBorderRadius};
    height: 100%;
    width: 2rem;
    background: linear-gradient(rgba(157, 113, 208, 0.15), rgba(66, 174, 203, 0.15));
    border-right: 2px solid ${Styles.faintBorderColor};
  }

  .main {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
  }

  &:hover {
    transform: scale(1.009);
  }

  .meta__bar {
    display: flex;
    .actions {
      margin-left: auto;
      i {
        font-size: 1rem;
        cursor: pointer;
      }
      &:hover {
        * {
          color: ${Styles.purple400};
        }
      }
    }
  }
`;

const DatasetCardBody: React.FC<{
  datasetId: string;
  title: string;
  timestamp: string;
  description?: string;
  setEditModalIsOpen: (open: boolean) => void;
  duplicateDataset: (datasetId: string, title: string) => Promise<void>;
  setDeleteConf: (deleting: boolean) => void;
}> = ({
  datasetId,
  title,
  timestamp,
  description,
  setEditModalIsOpen,
  duplicateDataset,
  setDeleteConf,
}) => {
  const [contextMenuIsOpen, setContextMenuIsOpen] = useState(false);

  const OPTIONS = [
    {
      label: 'Delete',
      onClick: () => {
        setDeleteConf(true);
        setEditModalIsOpen(true);
      },
      icon: <i style={{ color: Styles.red400 }} className="fal fa-times-circle" />,
    },
    {
      label: 'Rename',
      onClick: () => {
        setEditModalIsOpen(true);
      },
      icon: <i style={{ color: Styles.blue }} className="fad fa-edit" />,
    },
    {
      label: 'Open in new tab',
      onClick: () => window.open(makeDatasetLink(datasetId)),
      icon: <i className="fad fa-external-link" />,
    },
    {
      label: 'Duplicate',
      onClick: () => duplicateDataset(datasetId, `${title} (copy)`),
      icon: <i style={{ color: Styles.purple300 }} className="fad fa-folders" />,
    },
  ];

  return (
    <Link
      className="no-hover"
      style={{ textDecoration: 'none' }}
      to={makeDatasetLink(datasetId, false)}
      onContextMenu={e => {
        e.preventDefault();
        setContextMenuIsOpen(true);
      }}
    >
      <DatasetCardContainer>
        <div className="background" />
        <div className="main">
          <div className="meta__bar">
            <div className="time-ago__container">
              <Helper>Last updated: {humanizeTimeAgo(timestamp)}</Helper>
            </div>
            <div className="actions">
              <button
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setEditModalIsOpen(true);
                }}
                className="nostyle"
              >
                <i className="far fa-cog" />
              </button>
            </div>
          </div>
          <div className="label__container">
            <Label style={{ margin: 0 }}>{title}</Label>
          </div>

          {description && (
            <div className="description__container">
              <Text style={{ marginBottom: 0 }} size="sm" len="long">
                {description}
              </Text>
            </div>
          )}

          {contextMenuIsOpen && (
            <DropdownMenu
              options={OPTIONS}
              closeMenu={() => setContextMenuIsOpen(false)}
            />
          )}
        </div>
      </DatasetCardContainer>
    </Link>
  );
};

export default DatasetCardBody;

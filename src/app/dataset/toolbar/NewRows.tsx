import Modal from 'components/Modal';
import ButtonWithOptions from 'components/ui/ButtonWithOptions';
import DatasetContext from 'contexts/DatasetContext';
import React, { useContext, useState } from 'react';
import Styles from 'styles/Styles';
import { makeBoardActions } from '../lib/makeBoardActions';

const NewRows: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const { boardData, setBoardData } = useContext(DatasetContext)!;
  const boardActions = makeBoardActions(boardData);
  return (
    <>
      <ButtonWithOptions
        pos={{ right: 3.25 }}
        options={[
          {
            label: 'Empty row',
            onClick: () => setBoardData!(boardActions.newRow()),
            icon: <i className="fas fa-horizontal-rule" />,
          },
          {
            label: 'Add multiple empty rows',
            onClick: () => setBoardData!(boardActions.newRow()),
            icon: (
              <i style={{ color: Styles.purple }} className="fad fa-line-columns" />
            ),
          },
          {
            label: 'New rows from upload',
            onClick: () => setBoardData!(boardActions.newRow()),
            icon: <i style={{ color: Styles.blue }} className="far fa-file-plus" />,
          },
        ]}
      >
        Add rows
      </ButtonWithOptions>
      {modalIsOpen && (
        <Modal closeModal={() => setModalIsOpen(false)}>Hello world</Modal>
      )}
    </>
  );
};

export default NewRows;

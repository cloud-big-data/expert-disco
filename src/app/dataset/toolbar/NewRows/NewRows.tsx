import Modal from 'components/ui/Modal';
import ButtonWithOptions from 'components/ui/ButtonWithOptions';
import React, { useState } from 'react';
import Styles from 'styles/Styles';
import { useHistory } from 'react-router';
import FileUpload from './FileUpload';

const NewRows: React.FC = () => {
  enum NewRowViews {
    multipleEmpty,
    fromUpload,
  }
  const history = useHistory();
  const [view] = useState(NewRowViews.multipleEmpty);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const { boardData, setBoardData } = useContext(DatasetContext)!;
  // const boardActions = makeBoardActions(boardData);
  return (
    <>
      <ButtonWithOptions
        pos={{ right: 2.25 }}
        options={[
          {
            label: 'Empty row',
            onClick: () => undefined, // setBoardData!(boardActions.newRow()),
            icon: <i className="fas fa-horizontal-rule" />,
          },
          {
            label: 'New rows from file upload',
            onClick: () => {
              window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
              });
              history.push(`${window.location.pathname}?view=import`);
            },
            icon: <i style={{ color: Styles.blue }} className="far fa-file-plus" />,
          },
        ]}
      >
        Add rows
      </ButtonWithOptions>
      {modalIsOpen && (
        <Modal closeModal={() => setModalIsOpen(false)}>
          {view === NewRowViews.multipleEmpty && <p>Multiple empty</p>}
          {view === NewRowViews.fromUpload && (
            <FileUpload closeModal={() => setModalIsOpen(false)} />
          )}
        </Modal>
      )}
    </>
  );
};

export default NewRows;

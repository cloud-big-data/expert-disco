import { ButtonPrimary } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import { Text } from 'components/ui/Typography';
import React, { useState } from 'react';
import { Container } from './Styles';
import { IViewProps } from './types';

const SingleEmpty: React.FC<IViewProps> = ({
  boardActions,
  setBoardData,
  closeModal,
}) => {
  const [value, setValue] = useState('');
  return (
    <Container>
      <h3>Add a new column</h3>
      <Text style={{ width: '100%' }} len="short" size="sm">
        Column name:
      </Text>
      <InputField
        placeholder="Column a"
        value={value}
        onChange={e => setValue(e.target.value)}
        icon={<i className="fad fa-columns" />}
      />
      <ButtonPrimary
        onClick={() => {
          closeModal();
          setBoardData(boardActions.newColumn(value));
        }}
      >
        Add column
      </ButtonPrimary>
    </Container>
  );
};

export default SingleEmpty;

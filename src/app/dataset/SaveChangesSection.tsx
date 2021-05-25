import React, { FC } from 'react';
import classNames from 'classnames';
import { ButtonPrimary } from 'components/ui/Buttons';
import { Helper } from 'components/ui/Typography';

const SaveChangesSection: FC<{
  unsavedChanges: Record<string, any>;
  handleSave: () => void;
  loading: boolean;
}> = ({ unsavedChanges, handleSave, loading }) => (
  <div
    className={classNames(
      'fixed right-4 bottom-4',
      'flex items-center flex-col',
      'border-purple-gradient border-solid border',
      'shadow-sm',
      'bg-white',
      'p-4 rounded-2xl',
    )}
  >
    <h6>
      You have {Object.keys(unsavedChanges).length} unsaved{' '}
      {Object.keys(unsavedChanges).length === 1 ? 'change' : 'changes'}
    </h6>
    <Helper>Changes to your dataset will be applied upon save.</Helper>
    <ButtonPrimary loading={loading} onClick={handleSave}>
      Save
    </ButtonPrimary>
  </div>
);

export default SaveChangesSection;

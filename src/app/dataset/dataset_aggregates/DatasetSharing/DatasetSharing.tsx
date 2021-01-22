import { Privileges } from 'app/dataset/types';
import Radio from 'components/Radio';
import Separator from 'components/Separator';
import { ButtonPrimary } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import { Label } from 'components/ui/Typography';
import React, { FC, FormEvent, useState } from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const DatasetSharingContainer = styled.div`
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

  .radio__group {
    margin: 0 0 1rem;
    display: flex;
    align-items: center;
    label {
      margin-right: 1rem;
    }
  }

  .summary__container {
    display: flex;
    flex-direction: column;
  }
`;

interface Recipient {
  email: string;
  privileges: Privileges;
}

const DatasetSharing: FC = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { email: 'me@tristantarpley.com', privileges: 'viewer' },
  ]);

  const updateRecipientByIndex = (updatedData: Partial<Recipient>, index: number) =>
    setRecipients(
      recipients.map((rec, index_) =>
        index === index_ ? { ...recipients[index_], ...updatedData } : rec,
      ),
    );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <DatasetSharingContainer>
      <div className="title">
        <div className="icon__container">
          <i id="share_icon" className="far fa-user-plus" />
        </div>
        <h6 style={{ marginBottom: 0, marginLeft: '1rem' }}>
          Share this dataset with other users
        </h6>
      </div>
      <Separator />
      <form onSubmit={onSubmit}>
        {recipients.map((rec, index) => (
          <div key={rec.email}>
            <InputField
              label="Type the name of a user"
              name="recipient"
              type="email"
              placeholder="Add people or workspaces"
              value={rec.email}
              onChange={e =>
                updateRecipientByIndex(
                  {
                    email: e.target.value,
                  },
                  index,
                )
              }
              confirmText="save"
              onConfirm={() => console.log('hi')}
            />
            <Separator />
            {rec.email && (
              <div className="radio__group">
                <Label unBold>
                  <Radio
                    onClick={() =>
                      updateRecipientByIndex({ privileges: 'editor' }, index)
                    }
                    selected={rec.privileges === 'editor'}
                  />
                  Editor
                </Label>
                <Label unBold>
                  <Radio
                    onClick={() =>
                      updateRecipientByIndex({ privileges: 'owner' }, index)
                    }
                    selected={rec.privileges === 'owner'}
                  />
                  Owner
                </Label>
                <Label
                  onClick={() =>
                    updateRecipientByIndex({ privileges: 'viewer' }, index)
                  }
                  unBold
                >
                  <Radio selected={rec.privileges === 'viewer'} />
                  View only
                </Label>
              </div>
            )}
          </div>
        ))}

        {recipients.map((rec, index) => (
          <div key={rec.email} className="summary__container">
            {rec.email}
          </div>
        ))}

        <ButtonPrimary disabled={recipients.some(rec => !rec.email)}>
          Done
        </ButtonPrimary>
      </form>
    </DatasetSharingContainer>
  );
};

export default DatasetSharing;

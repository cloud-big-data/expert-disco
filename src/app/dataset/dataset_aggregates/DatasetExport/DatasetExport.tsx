import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { Steps } from 'antd';
import { Destinations } from 'app/dataset/types';
import DatasetContext from 'contexts/DatasetContext';
import { Text } from 'components/ui/Typography';
import { ButtonPrimary } from 'components/ui/Buttons';
import SingleSelect from 'components/SingleSelect';
import SkyvueExport from './Destinations/SkyvueExport';

const { Step } = Steps;

const ExportContainer = styled.div`
  display: flex;
  flex-direction: column;

  .steps__container {
    display: flex;
    flex: 1 1;
  }

  .destinations__container {
    margin-top: 1rem;
  }

  .output-settings__container {
    margin-top: 2rem;
  }
`;

const DatasetExport: React.FC = () => {
  const { datasetHead, socket } = useContext(DatasetContext)!;
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState<Destinations | undefined>(
    undefined,
  );

  return (
    <ExportContainer>
      <div className="steps__container">
        <Steps current={step}>
          <Step
            title="Pick a destination"
            description="Where would you like us to send this dataset?"
            onClick={() => setStep(0)}
          />
          <Step title="Access your data" />
        </Steps>
      </div>
      <div className="body__container">
        {step === 0 && (
          <div className="output-settings__container">
            <SingleSelect
              options={[
                { label: 'CSV', value: 'csv' },
                { label: 'Google Sheets', value: 'sheets' },
                { label: 'To a new Skyvue', value: 'skyvue' },
              ]}
              onSelect={(dest?: string) => setDestination(dest as Destinations)}
              selected={destination}
            />
            <div className="buttons">
              <ButtonPrimary
                onClick={() => {
                  setStep(1);
                  socket?.emit('exportToCsv', {
                    title: datasetHead?.title,
                    destination,
                  });
                }}
                disabled={!destination}
              >
                Continue
              </ButtonPrimary>
            </div>
          </div>
        )}
        {step === 1 &&
          (destination === 'skyvue' ? (
            <div className="output-settings__container">
              <SkyvueExport />
            </div>
          ) : destination === 'csv' ? (
            <div className="output-settings__container">
              <h5>Your download has started</h5>
              <Text size="sm" len="short">
                It may take a few moments for the dataset to be fully downloaded,
                depending on the size of the file.
              </Text>
            </div>
          ) : (
            <div className="output-settings__container">
              <p>Sorry, we don't yet support {destination} as a destination!</p>
            </div>
          ))}
      </div>
    </ExportContainer>
  );
};

export default DatasetExport;

import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { Steps } from 'antd';
import Styles from 'styles/Styles';
import { Destinations } from 'app/dataset/types';
import DatasetContext from 'contexts/DatasetContext';
// import humanFileSize from 'utils/humanFileSize';
import { Text } from 'components/ui/Typography';
import InputField from 'components/ui/InputField';
import { ButtonPrimary } from 'components/ui/Buttons';

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
    display: grid;
    grid-template-columns: repeat(3, 1.33fr);
  }

  .output-settings__container {
    margin-top: 2rem;
    /* display: flex; */
  }
`;

const Destination = styled.button`
  background: none;
  display: flex;
  align-items: center;
  border: 2px solid ${Styles.faintBorderColor};
  border-radius: ${Styles.defaultBorderRadius};
  padding: 1rem;
  font-size: 1.25rem;
  box-shadow: ${Styles.boxShadow};

  .icon {
    font-size: 1.5rem;
    margin-right: 1rem;
  }
`;

const DatasetExport: React.FC = () => {
  const { datasetHead, socket } = useContext(DatasetContext)!;
  // const { csvFileSize } = datasetHead;
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState<Destinations | undefined>(
    undefined,
  );

  const [numExports, setNumExports] = useState(1);

  return (
    <ExportContainer>
      <div className="steps__container">
        <Steps current={step}>
          <Step
            title="Pick a destination"
            description="Where would you like us to send this dataset?"
          />
          <Step
            title="How should we send it?"
            description="Just a few more details"
          />
          <Step title="Access your data" />
        </Steps>
      </div>
      <div className="body__container">
        {step === 0 && (
          <div className="destinations__container">
            <Destination
              onClick={() => {
                setDestination('csv');
                setStep(1);
              }}
            >
              <div className="icon">
                <i className="fad fa-file-csv" />
              </div>
              export to csv
            </Destination>
          </div>
        )}
        {step === 1 &&
          (destination === 'csv' ? (
            <div className="output-settings__container">
              <h5>How many files should we export?</h5>
              <Text size="sm" len="short">
                Different apps require different sized files. Skyvue allows you to
                export your dataset to as many files as you need in order to get
                manageable file sizes that you can open in all of your favorite data
                tools.
              </Text>
              <InputField
                value={numExports}
                onChange={e => {
                  if (parseInt(e.target.value, 10) > 0 || e.target.value === '') {
                    setNumExports(parseInt(e.target.value, 10));
                  }
                }}
                type="number"
              />
              <ButtonPrimary
                onClick={() => {
                  socket?.emit('exportToCsv', datasetHead.title);
                  setStep(2);
                }}
                disabled={Number.isNaN(numExports) || numExports < 1}
              >
                Start download
              </ButtonPrimary>
            </div>
          ) : (
            ''
          ))}

        {step === 2 && (
          <div className="output-settings__container">
            <h5>Your download has started</h5>
            <Text size="sm" len="short">
              It may take a few moments for the dataset to be fully downloaded,
              depending on the size of the file.
            </Text>
          </div>
        )}
      </div>
    </ExportContainer>
  );
};

export default DatasetExport;

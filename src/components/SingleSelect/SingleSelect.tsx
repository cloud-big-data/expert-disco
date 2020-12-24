import Radio from 'components/Radio';
import React from 'react';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import classNames from 'classnames';
import { Label } from 'components/ui/Typography';
import { ValueSet } from 'app/dataset/types';

const SingleSelectContainer = styled.div`
  display: flex;
  flex-direction: column;

  .option {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: ${Styles.defaultBorderRadius};
    border: 1px solid ${Styles.faintBorderColor};
    text-align: left;
    background: ${Styles.purple100};
    outline: none;
    box-shadow: ${Styles.xsBoxShadow};
    transition-duration: ${Styles.defaultTransitionDuration};

    .label {
      margin-left: 0.5rem;
    }
  }

  .option:hover {
    cursor: pointer;
    background: ${Styles.purple100};
    border-color: ${Styles.purple400};
    box-shadow: ${Styles.smBoxShadow};
  }
`;

const SingleSelect: React.FC<{
  selected?: string;
  options: ValueSet[];
  onSelect: (selected?: string) => void;
}> = ({ options, selected, onSelect }) => (
  <SingleSelectContainer>
    {options.map((opt, index) => (
      <div
        role="button"
        tabIndex={index}
        key={opt.value}
        onClick={() => onSelect(opt.value === selected ? undefined : opt.value)}
        className={classNames('option', { selected: selected === opt.value })}
      >
        <Radio selected={selected === opt.value} />
        <span className="label">
          <Label unBold>{opt.label}</Label>
        </span>
      </div>
    ))}
  </SingleSelectContainer>
);

export default SingleSelect;

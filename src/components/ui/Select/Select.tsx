import React from 'react';
import SelectSearch, { SelectSearchProps } from 'react-select-search';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

const SelectContainer = styled.div<{ fill?: string }>`
  *,
  *::after,
  *::before {
    box-sizing: inherit;
  }

  .select-search {
    display: flex;
    width: 100%;
    position: relative;
    box-sizing: border-box;
  }

  .select-search__value {
    display: flex;
    flex: 1;
    position: relative;
    z-index: 1;
  }

  .select-search__value::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: calc(50% - 9px);
    right: 19px;
    width: 11px;
    height: 11px;
  }

  .select-search__input {
    display: block;
    height: 2rem;
    width: 100%;
    padding: 1rem;
    background: ${props => props.fill ?? '#fff'};
    border: 2px solid ${Styles.faintBorderColor};
    border-radius: ${Styles.defaultBorderRadius};
    outline: none;
    font-size: 14px;
    text-align: left;
    text-overflow: ellipsis;
    line-height: 2rem;
    -webkit-appearance: none;
  }

  .select-search__input::-webkit-search-decoration,
  .select-search__input::-webkit-search-cancel-button,
  .select-search__input::-webkit-search-results-button,
  .select-search__input::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .select-search__input:not([readonly]):focus {
    cursor: initial;
  }

  .select-search__select {
    background: #fff;
    box-shadow: ${Styles.boxShadow};
    border: 2px solid ${Styles.faintBorderColor};
    ${Styles.fadeIn}
  }

  .select-search__options {
    list-style: none;
    padding: 0.25rem 0.5rem;
  }

  .select-search__option,
  .select-search__not-found {
    display: block;
    height: 2.25rem;
    margin-top: 0.25rem;
    width: 100%;
    padding: 0 1rem;
    background: #fff;
    border: none;
    outline: none;
    font-size: 0.875rem;
    text-align: left;
    cursor: pointer;
  }

  .select-search--multiple .select-search__option {
    height: 48px;
  }

  .select-search__option.is-selected {
    background-color: hsla(0, 0%, 0%, 0.05);
    border-radius: ${Styles.defaultBorderRadius};
    font-weight: bold;
  }

  .select-search__option.is-highlighted,
  .select-search__option:not(.is-selected):hover {
    background-color: hsla(0, 0%, 0%, 0.05);
    border-radius: ${Styles.defaultBorderRadius};
  }

  .select-search__option.is-highlighted.is-selected,
  .select-search__option.is-selected:hover {
    opacity: 0.7;
  }

  .select-search__group-header {
    font-size: 10px;
    text-transform: uppercase;
    padding: 8px 16px;
  }

  .select-search.is-disabled {
    opacity: 0.5;
  }

  .select-search.is-loading .select-search__value::after {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Cpath fill='%232F2D37' d='M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 25 25' to='360 25 25' dur='0.6s' repeatCount='indefinite'/%3E%3C/path%3E%3C/svg%3E");
    background-size: 11px;
  }

  .select-search:not(.is-disabled) .select-search__input {
    cursor: pointer;
  }

  .select-search--multiple {
    border-radius: ${Styles.defaultBorderRadius};
    overflow: hidden;
  }

  .select-search:not(.is-loading):not(.select-search--multiple)
    .select-search__value::after {
    transform: rotate(45deg);
    border-right: 2px solid ${Styles.fontColor};
    border-bottom: 2px solid ${Styles.fontColor};
    pointer-events: none;
  }

  .select-search--multiple .select-search__input {
    cursor: initial;
  }

  .select-search--multiple .select-search__input {
    border-radius: 3px 3px 0 0;
  }

  .select-search--multiple:not(.select-search--search) .select-search__input {
    cursor: default;
  }

  .select-search:not(.select-search--multiple) .select-search__input:hover {
    border: 2px solid rgba(0, 0, 0, 0.1);
  }

  .select-search:not(.select-search--multiple) .select-search__select {
    position: absolute;
    z-index: 2;
    top: 44px;
    right: 0;
    left: 0;
    border-radius: ${Styles.defaultBorderRadius};
    overflow: auto;
    max-height: 360px;
  }

  .select-search--multiple .select-search__select {
    position: relative;
    overflow: auto;
    max-height: 260px;
    border-radius: 0 0 3px 3px;
  }

  .select-search__not-found {
    height: auto;
    padding: 16px;
    text-align: center;
    color: #888;
  }
`;

interface ISelect extends SelectSearchProps {
  onChange: (param: any) => void;
  fill?: string;
}

const Select: React.FC<ISelect> = ({
  onChange,
  options,
  search,
  placeholder,
  value,
  fill,
  className,
}) => (
  <SelectContainer fill={fill}>
    <SelectSearch
      onChange={onChange}
      options={options}
      search={search}
      placeholder={placeholder}
      value={value}
    />
  </SelectContainer>
);

export default Select;

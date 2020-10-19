import React from 'react';
import styled from 'styled-components/macro';

const GridContainer = styled.div`
  display: flex;
`;

/*
local state:
- cell(s) is/are highlighted
- cell(s) is/are active

lifted state:
- column/row width/height
- cell content
*/

const Grid: React.FC = () => {
  return (
    <GridContainer>
      <p>Grid</p>
    </GridContainer>
  )
}

export default Grid;
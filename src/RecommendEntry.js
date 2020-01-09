import React from 'react';
import styled from 'styled-components';

const NameList = styled.li`
  font-family: 'Gothic A1', sans-serif;
  font-size: 0.5cm;
  border: 2px solid;
  border-color: #2f363d;
  box-decoration-break: clone;
  list-style-type: none;
`;
const Winrate = styled.span`
  float: right;
`;

function RecommendEntry(props) {
  let imageURL = `http://cdn.dota2.com/apps/dota2/images/heroes/${props.imageName}_sb.png`;
  return (
    <NameList key={props.heroId}>
      <img src={imageURL} alt={props.name}></img>
      {props.name}
      <Winrate>
        winrate: {(props.winrate * 100).toString().substr(0, 4)}%
      </Winrate>
    </NameList>
  );
}

export default RecommendEntry;

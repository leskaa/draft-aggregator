import React from 'react';
import styled from 'styled-components';

const NameList = styled.li`
  font-family: 'Gothic A1', sans-serif;
  font-size: 0.7cm;
  border: 5px solid;
  border-bottom: 0px solid;
  border-color: #2f363d;
  box-decoration-break: clone;
  list-style-type: none;
  height: 33px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Name = styled.div`
  margin-left: 0.5em;
  margin-right: 0.5em;
`;

const Winrate = styled.span`
  margin-left: auto;
  order: 2;
`;

function RecommendEntry(props) {
  let imageURL = `http://cdn.dota2.com/apps/dota2/images/heroes/${props.imageName}_sb.png`;
  return (
    <NameList key={props.heroId}>
      <img src={imageURL} alt={props.name}></img>
      <Name>{props.name}</Name>
      <Winrate>{(props.winrate * 100).toString().substr(0, 4)}%</Winrate>
    </NameList>
  );
}

export default RecommendEntry;

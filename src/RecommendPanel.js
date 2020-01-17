import React from 'react';
import styled from 'styled-components';
import RecommendEntry from './RecommendEntry';

const RecommendationsList = styled.ul`
  margin-left: -38px;
  margin-top: 1px;
  background: #1b1e21;
  color: #fefefe;
  list-style-type: none;
`;

function RecommendPanel(props) {
  return (
    <RecommendationsList>
      {props.recommendations.map(recommendation => (
        <RecommendEntry
          key={recommendation.heroId}
          heroId={recommendation.heroId}
          name={recommendation.name}
          winrate={recommendation.winrate}
          imageName={recommendation.short_name}
          reasonList={recommendation.reasonList}
        ></RecommendEntry>
      ))}
    </RecommendationsList>
  );
}

export default RecommendPanel;

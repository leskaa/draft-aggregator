import React from 'react';

import RecommendEntry from './RecommendEntry';

function RecommendPanel(props) {
  return (
    <ul>
      {props.recommendations.map(recommendation => (
        <RecommendEntry
          key={recommendation.heroId}
          heroId={recommendation.heroId}
          name={recommendation.name}
          winrate={recommendation.winrate}
        ></RecommendEntry>
      ))}
    </ul>
  );
}

export default RecommendPanel;

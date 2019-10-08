import React from 'react';
// import { css, jsx } from '@emotion/core';

import RecommendEntry from './RecommendEntry';

class RecommendPanel extends React.Component {
  render() {
    return (
      <ul>
        {this.props.recommendations.map(recommendation => (
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
}

export default RecommendPanel;

import React from 'react';
import styled from '@emotion/styled';
import RecommendEntry from './RecommendEntry';

const RecommendationsList = styled.ul`
  margin-left: -40px;
  margin-top: 0px;
  margin-bottom: 0px;
  background: #1b1e21;
  color: #fefefe;
  list-style-type: none;
`;

type Reason = {
  name: string;
  winrate: number;
  team: string;
};

type Recommendation = {
  heroId: number;
  name: string;
  winrate: number;
  short_name: string;
  reasonList: Reason[];
};

type RecommendPanelProps = {
  recommendations: Recommendation[];
};

function RecommendPanel(props: RecommendPanelProps) {
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

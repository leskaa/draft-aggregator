import React from 'react';

function RecommendEntry(props) {
  return (
    <li key={props.heroId}>
      {props.name} Winrate: {(props.winrate * 100).toString().substr(0, 4)}%
    </li>
  );
}

export default RecommendEntry;

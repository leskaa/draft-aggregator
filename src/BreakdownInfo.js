import React from 'react';
import styled from 'styled-components';

function BreakdownInfo(props) {
  let reasonList = props.reasons.sort((a, b) => b.winrate - a.winrate);
  return (
    <div>
      <h2>{props.hero}</h2>
      {reasonList.map((e, i) => {
        return (
          <div>
            {e.winrate > 0.5 ? '☝️ ' : '👇 '}
            {e.team === 'counter' || e.team === 'synergy' ? e.name : ''}
            {e.team}
            {': '}
            <strong
              style={
                e.winrate > 0.5 ? { color: '#167c13' } : { color: '#a52a2a' }
              }
              key={i}
            >
              {(e.winrate * 100).toString().substr(0, 4)}%
            </strong>
          </div>
        );
      })}
    </div>
  );
}

export default BreakdownInfo;

import React from 'react';

function BreakdownInfo(props) {
  let reasonList = props.reasons.sort((a, b) => b.winrate - a.winrate);
  return (
    <div>
      <h2>{props.hero}</h2>
      {reasonList.map((e, i) => {
        return (
          <div key={i}>
            {e.team === 'counter' && e.winrate > 0.5
              ? 'Counters ' + e.name + ': '
              : ''}
            {e.team === 'counter' && e.winrate === 0.5
              ? 'Limited Data Against ' + e.name + ': '
              : ''}
            {e.team === 'counter' && e.winrate < 0.5
              ? 'Countered By ' + e.name + ': '
              : ''}
            {e.team === 'synergy' && e.winrate >= 0.5
              ? 'Synergy With ' + e.name + ': '
              : ''}
            {e.team === 'synergy' && e.winrate < 0.5
              ? 'Anti-Synergy With ' + e.name + ': '
              : ''}
            {e.team === 'pub' ? 'Public Match Winrate: ' : ''}
            {e.team === 'meta' ? 'Adjusted Pro Pick+Ban: ' : ''}
            <strong
              style={
                e.winrate > 0.5 ? { color: '#167c13' } : { color: '#a52a2a' }
              }
              key={i}
            >
              {(e.winrate * 100).toString().substr(0, 4)}%
              {e.winrate >= 0.5 ? ' ☝️' : ' 👇'}
            </strong>
          </div>
        );
      })}
    </div>
  );
}

export default BreakdownInfo;

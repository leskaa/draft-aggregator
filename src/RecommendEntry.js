import React from 'react';
import styled from 'styled-components';

const NameList = styled.li`
  font-family: 'Gothic A1', sans-serif;
  font-size: 1.75em;
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
  flex-basis: 100%;
`;

const ReasonCounters = styled.span`
  font-size: 0.4cm;
  margin: 2em;
  flex: 1;
  min-width: 8em;
  color: #167c13;
`;

const ReasonSynergizes = styled.span`
  font-size: 0.4cm;
  margin: 2em;
  flex: 1;
  min-width: 8em;
  color: #598307;
`;

const ReasonCountered = styled.span`
  font-size: 0.4cm;
  margin: 2em;
  flex: 1;
  min-width: 8em;
  color: #a52a2a;
`;

const ReasonAntiSynergy = styled.span`
  font-size: 0.4cm;
  margin: 2em;
  flex: 1;
  min-width: 8em;
  color: #4682b4;
`;

const ReasonMeta = styled.span`
  font-size: 0.4cm;
  margin: 2em;
  flex: 1;
  min-width: 8em;
  color: #daa520;
`;

const ReasonNotMeta = styled.span`
  font-size: 0.4cm;
  margin: 2em;
  flex: 1;
  min-width: 8em;
  color: #5b388f;
`;

const Winrate = styled.span`
  margin-left: auto;
  order: 3;
`;

function RecommendEntry(props) {
  let imageURL = `http://cdn.dota2.com/apps/dota2/images/heroes/${props.imageName}_sb.png`;
  console.log(props.reasonList);
  let topReasons =
    props.winrate > 0.5
      ? props.reasonList
          .sort((a, b) => b.winrate - a.winrate)
          .filter(reason => reason.winrate > 0.5)
          .slice(0, 2)
      : props.reasonList
          .sort((a, b) => a.winrate - b.winrate)
          .filter(reason => reason.winrate < 0.45)
          .slice(0, 2);
  return (
    <NameList key={props.heroId}>
      <img src={imageURL} alt={props.name}></img>
      <Name>{props.name}</Name>
      {topReasons.map((e, i) => {
        if (e.team === 'meta') {
          if (e.winrate > 0.5) {
            return (
              <ReasonMeta key={i}>
                Pro{' '}
                <strong>
                  Meta{' '}
                  <span role="img" aria-label="Sparkle">
                    ✨
                  </span>
                </strong>
              </ReasonMeta>
            );
          }
          return (
            <ReasonNotMeta key={i}>
              Not{' '}
              <strong>
                Meta{' '}
                <span role="img" aria-label="Eggplant">
                  🍆
                </span>
              </strong>
            </ReasonNotMeta>
          );
        }
        if (e.team === 'counter') {
          if (e.winrate > 0.5) {
            return (
              <ReasonCounters key={i}>
                Counters <strong>{e.name}</strong>
              </ReasonCounters>
            );
          }
          return (
            <ReasonCountered key={i}>
              Is Countered <strong>{e.name}</strong>
            </ReasonCountered>
          );
        }
        if (e.winrate > 0.5) {
          return (
            <ReasonSynergizes key={i}>
              Synergy <strong>{e.name}</strong>
            </ReasonSynergizes>
          );
        }
        return (
          <ReasonAntiSynergy key={i}>
            Anti Synergy <strong>{e.name}</strong>
          </ReasonAntiSynergy>
        );
      })}
      <Winrate>{(props.winrate * 100).toString().substr(0, 4)}%</Winrate>
    </NameList>
  );
}

export default RecommendEntry;

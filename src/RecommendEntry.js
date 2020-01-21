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
  font-size: 0.35cm;
  margin: 1em;
  margin-left: 0.5em;
  flex: 1;
  min-width: 11em;
  color: #167c13;
`;

const ReasonSynergizes = styled.span`
  font-size: 0.35cm;
  margin: 1em;
  margin-left: 0.5em;
  flex: 1;
  min-width: 11em;
  color: #598307;
`;

const ReasonCountered = styled.span`
  font-size: 0.35cm;
  margin: 1em;
  margin-left: 0.5em;
  flex: 1;
  min-width: 11em;
  color: #a52a2a;
`;

const ReasonAntiSynergy = styled.span`
  font-size: 0.35cm;
  margin: 1em;
  margin-left: 0.5em;
  flex: 1;
  min-width: 11em;
  color: #4682b4;
`;

const ReasonMeta = styled.span`
  font-size: 0.35cm;
  margin: 1em;
  margin-left: 0.5em;
  flex: 1;
  min-width: 11em;
  color: #daa520;
`;

const ReasonNotMeta = styled.span`
  font-size: 0.35cm;
  margin: 1em;
  margin-left: 0.5em;
  flex: 1;
  min-width: 11em;
  color: #5b388f;
`;

const ReasonPubMeta = styled.span`
  font-size: 0.35cm;
  margin: 1em;
  margin-left: 0.5em;
  flex: 1;
  min-width: 11em;
  color: #64d74a;
`;

const ReasonNotPubMeta = styled.span`
  font-size: 0.35cm;
  margin: 1em;
  margin-left: 0.5em;
  flex: 1;
  min-width: 11em;
  color: #476291;
`;

const Winrate = styled.span`
  margin-left: auto;
  order: 3;
`;

function RecommendEntry(props) {
  let imageURL = `http://cdn.dota2.com/apps/dota2/images/heroes/${props.imageName}_sb.png`;
  let topReasons = props.reasonList
    .sort((a, b) => Math.abs(b.winrate - 0.5) - Math.abs(a.winrate - 0.5))
    .filter(reason => Math.abs(reason.winrate - 0.5) > 0.04)
    .slice(0, 2);
  return (
    <NameList key={props.heroId}>
      <img src={imageURL} alt={props.name}></img>
      <Name>{props.name}</Name>
      {topReasons.map((e, i) => {
        if (e.team === 'pub') {
          if (e.winrate > 0.5) {
            return (
              <ReasonPubMeta key={i}>
                Pub <strong>Meta </strong>
              </ReasonPubMeta>
            );
          }
          return (
            <ReasonNotPubMeta key={i}>
              Poor Pub
              <br />
              <strong>Winrate </strong>
            </ReasonNotPubMeta>
          );
        }
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
                Counters <br />
                <strong>{e.name}</strong>
              </ReasonCounters>
            );
          }
          return (
            <ReasonCountered key={i}>
              Countered <br />
              <strong>{e.name} </strong>
            </ReasonCountered>
          );
        }
        if (e.winrate > 0.5) {
          return (
            <ReasonSynergizes key={i}>
              Synergy <br />
              <strong>{e.name}</strong>
            </ReasonSynergizes>
          );
        }
        return (
          <ReasonAntiSynergy key={i}>
            Synergy <br />
            <strong>{e.name}</strong>
          </ReasonAntiSynergy>
        );
      })}
      <Winrate>{(props.winrate * 100).toString().substr(0, 4)}%</Winrate>
    </NameList>
  );
}

export default RecommendEntry;

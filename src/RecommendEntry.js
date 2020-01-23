import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';

import BreakdownInfo from './BreakdownInfo';

Modal.setAppElement('#root');

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(47, 54, 61, 0.75)',
    zIndex: '10',
  },
  content: {
    color: '#fefefe',
    border: '5px solid #a52a2a',
    backgroundColor: '#1b1e21',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '10',
  },
};

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

  &:hover {
    position: relative;
    border-bottom: 5px solid;
    margin-bottom: -5px;
    border-color: #41484e;
    z-index: 5;
    position: relative;
  }
`;

const Name = styled.div`
  margin-left: 0.5em;
  margin-right: 0.5em;
  flex-basis: 100%;
`;

const Reason = styled.span`
  font-size: 0.35cm;
  margin: 1em;
  margin-left: 0.5em;
  flex: 1;
  min-width: 11em;
`;

const ReasonCounters = styled(Reason)`
  color: #167c13;
`;

const ReasonSynergizes = styled(Reason)`
  color: #598307;
`;

const ReasonCountered = styled(Reason)`
  color: #a52a2a;
`;

const ReasonAntiSynergy = styled(Reason)`
  color: #4682b4;
`;

const ReasonMeta = styled(Reason)`
  color: #daa520;
`;

const ReasonNotMeta = styled(Reason)`
  color: #5b388f;
`;

const ReasonPubMeta = styled(Reason)`
  color: #64d74a;
`;

const ReasonNotPubMeta = styled(Reason)`
  color: #476291;
`;

const Winrate = styled.span`
  margin-left: auto;
  order: 3;
`;

function RecommendEntry(props) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const afterOpenModal = () => {};

  let imageURL = `http://cdn.dota2.com/apps/dota2/images/heroes/${props.imageName}_sb.png`;

  let topReasons = props.reasonList
    .sort((a, b) => Math.abs(b.winrate - 0.5) - Math.abs(a.winrate - 0.5))
    .filter(reason => Math.abs(reason.winrate - 0.5) > 0.04)
    .slice(0, 2);

  return (
    <div>
      <NameList key={props.heroId} onClick={openModal}>
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
              Anti-Synergy <br />
              <strong>{e.name}</strong>
            </ReasonAntiSynergy>
          );
        })}
        <Winrate>{(props.winrate * 100).toString().substr(0, 4)}%</Winrate>
      </NameList>
      <Modal
        isOpen={isOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Example Modal"
      >
        <BreakdownInfo
          hero={props.name}
          reasons={props.reasonList}
        ></BreakdownInfo>
        {/* <button onClick={closeModal}>close</button> */}
      </Modal>
    </div>
  );
}

export default RecommendEntry;

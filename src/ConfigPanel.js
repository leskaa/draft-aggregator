import React, { useState } from 'react';
import styled from 'styled-components';
import ReactSlider from 'react-slider';

const StyledSlider = styled(ReactSlider)`
  width: 90%;
  height: 1.5rem;
  margin-top: 0.5rem;
  margin-left: 5%;
`;

const StyledThumb = styled.div`
  height: 1.5rem;
  line-height: 1.5rem;
  width: 1.5rem;
  text-align: center;
  background-color: #2f363d;
  color: #fefefe;
  border-radius: 50%;
  cursor: grab;
`;

const Thumb = (props, state) => (
  <StyledThumb {...props}>{state.valueNow}</StyledThumb>
);

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${props =>
    props.index === 2 ? '#64d74a' : props.index === 1 ? '#daa520' : '#167c13'};
  border-radius: 999px;
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

const ReasonCounters = styled.span`
  font-size: 1rem;
  color: #167c13;
`;

const ReasonMeta = styled.span`
  font-size: 1rem;
  color: #daa520;
`;

const ReasonPubMeta = styled.span`
  font-size: 1rem;
  color: #64d74a;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 3em;
  margin-right: 3em;
  margin-top: 0em;
`;

function ConfigPanel(props) {
  const [counterWeight, setCounterWeight] = useState(60);
  const [proWeight, setProWeight] = useState(20);
  const [pubWeight, setPubWeight] = useState(20);

  const handleChange = event => {
    props.onChange(event[0], event[1] - event[0], 100 - event[1]);
    setCounterWeight(event[0]);
    setProWeight(event[1] - event[0]);
    setPubWeight(100 - event[1]);
  };

  return (
    <div>
      <StyledSlider
        defaultValue={[counterWeight, counterWeight + proWeight]}
        renderTrack={Track}
        renderThumb={Thumb}
        onAfterChange={handleChange}
      />
      <FlexContainer>
        <ReasonCounters>Counters</ReasonCounters>
        <ReasonMeta>Pro Meta</ReasonMeta>
        <ReasonPubMeta>Pub Meta</ReasonPubMeta>
      </FlexContainer>
      <FlexContainer style={{ marginLeft: '4em', marginRight: '4em' }}>
        <ReasonCounters>
          <strong>{counterWeight}%</strong>
        </ReasonCounters>
        <ReasonMeta>
          <strong>{proWeight}%</strong>
        </ReasonMeta>
        <ReasonPubMeta>
          <strong>{pubWeight}%</strong>
        </ReasonPubMeta>
      </FlexContainer>
    </div>
  );
}

export default ConfigPanel;

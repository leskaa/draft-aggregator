import React, { useState } from 'react';
import styled from 'styled-components';
import ReactSlider from 'react-slider';

const StyledSlider = styled(ReactSlider)`
  width: 90%;
  height: 25px;
  margin-top: 25px;
  margin-left: 5%;
`;

const StyledThumb = styled.div`
  height: 25px;
  line-height: 25px;
  width: 25px;
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
  font-size: 0.5cm;
  color: #167c13;
`;

const ReasonMeta = styled.span`
  font-size: 0.5cm;
  color: #daa520;
`;

const ReasonPubMeta = styled.span`
  font-size: 0.5cm;
  color: #64d74a;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 3em;
  margin-right: 3em;
  margin-top: 0.5em;
`;

function ConfigPanel(props) {
  const [counterWeight, setCounterWeight] = useState(80);
  const [proWeight, setProWeight] = useState(10);
  const [pubWeight, setPubWeight] = useState(10);

  const handleChange = event => {
    props.onChange(event[0], event[1] - event[0], 100 - event[1]);
    setCounterWeight(event[0]);
    setProWeight(event[1] - event[0]);
    setPubWeight(100 - event[1]);
  };

  return (
    <div>
      <StyledSlider
        defaultValue={[80, 90]}
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

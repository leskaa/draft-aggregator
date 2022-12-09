import React, { useState } from 'react'
import styled from '@emotion/styled'
import ReactSlider from 'react-slider'

const StyledSlider = styled(ReactSlider)`
  width: 90%;
  height: 1.5rem;
  margin-top: 0.5rem;
  margin-left: 5%;
`

const StyledThumb = styled.div`
  height: 1.5rem;
  line-height: 1.5rem;
  width: 1.5rem;
  text-align: center;
  background-color: #2f363d;
  color: #fefefe;
  border-radius: 50%;
  cursor: grab;
`

const Thumb = (props: any, state: any) => (
  <StyledThumb {...props}>{state.valueNow}</StyledThumb>
)

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${(props: any) =>
    props.index === 2 ? '#64d74a' : props.index === 1 ? '#daa520' : '#167c13'};
  border-radius: 999px;
`

const Track = (props: any, state: any) => (
  <StyledTrack {...props} index={state.index} />
)

const ReasonCounters = styled.span`
  font-size: 1rem;
  color: #167c13;
`

const ReasonSynergizes = styled.span`
  font-size: 1rem;
  color: #598307;
`

const ReasonMeta = styled.span`
  font-size: 1rem;
  color: #daa520;
`

const ReasonPubMeta = styled.span`
  font-size: 1rem;
  color: #64d74a;
`

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 3em;
  margin-right: 3em;
  margin-top: 0em;
`

type ConfigPanelProps = {
  onChange: (
    counterWeight: number,
    synergyWeight: number,
    proWeight: number,
    pubWeight: number
  ) => void
}

function ConfigPanel(props: ConfigPanelProps) {
  const [counterWeight, setCounterWeight] = useState(40)
  const [synergyWeight, setSynergyWeight] = useState(20)
  const [proWeight, setProWeight] = useState(20)
  const [pubWeight, setPubWeight] = useState(20)

  const handleChange = (value: number | readonly number[]): void => {
    if (Array.isArray(value)) {
      props.onChange(
        value[0],
        value[1] - value[0],
        value[2] - value[1],
        100 - value[2]
      )
      setCounterWeight(value[0])
      setSynergyWeight(value[1] - value[0])
      setProWeight(value[2] - value[1])
      setPubWeight(100 - value[2])
    }
  }

  return (
    <div>
      <StyledSlider
        defaultValue={[
          counterWeight,
          counterWeight + synergyWeight,
          counterWeight + synergyWeight + proWeight
        ]}
        renderTrack={Track}
        renderThumb={Thumb}
        onAfterChange={handleChange}
      />
      <FlexContainer>
        <ReasonCounters>Counters</ReasonCounters>
        <ReasonSynergizes>Synergy</ReasonSynergizes>
        <ReasonMeta>Pro Meta</ReasonMeta>
        <ReasonPubMeta>Pub Meta</ReasonPubMeta>
      </FlexContainer>
      <FlexContainer style={{ marginLeft: '4em', marginRight: '4em' }}>
        <ReasonCounters>
          <strong>{counterWeight}%</strong>
        </ReasonCounters>
        <ReasonSynergizes>
          <strong>{synergyWeight}%</strong>
        </ReasonSynergizes>
        <ReasonMeta>
          <strong>{proWeight}%</strong>
        </ReasonMeta>
        <ReasonPubMeta>
          <strong>{pubWeight}%</strong>
        </ReasonPubMeta>
      </FlexContainer>
    </div>
  )
}

export default ConfigPanel

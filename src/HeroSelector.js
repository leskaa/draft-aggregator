import React, { useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';

const DotaSelect = styled(Select)``;

function HeroSelector(props) {
  const [selected, setSelected] = useState(null);

  const handleChange = selection => {
    let team = props.team;
    if (selection == null) {
      props.removeFromTeam(selected.value, team);
    } else if (selected != null) {
      props.removeFromTeam(selected.value, team);
      props.addToTeam(selection.value, team);
    } else {
      props.addToTeam(selection.value, team);
    }
    setSelected(selection);
  };

  return (
    <DotaSelect
      value={selected}
      onChange={handleChange}
      isClearable="true"
      menuShouldScrollIntoView="true"
      options={props.options.map(option => ({
        value: option.id,
        label: option.localized_name,
      }))}
      theme={theme => ({
        ...theme,
        colors: {
          ...theme.colors,
          text: 'orangered',
          primary25: 'hotpink',
          primary: 'black',
        },
      })}
    />
  );
}

export default HeroSelector;

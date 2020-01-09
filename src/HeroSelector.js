import React, { useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';

const DotaSelect = styled(Select)`
  padding: 0.4em;
  margin-left: 0.5em;
  margin-right: 0.5em;
  color: #a0a3a6;
`;

const customStyles = {
  control: (base, state) => ({
    ...base,
    background: '#2F363D',
    // match with the menu
    borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
    // Overwrittes the different states of border
    borderColor: state.isFocused ? '#545A60' : '#545A60',
    // Removes weird border around container
    boxShadow: state.isFocused ? null : null,
    '&:hover': {
      // Overwrittes the different states of border
      borderColor: state.isFocused ? '#7A7F83' : '#7A7F83',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? '#fefefe' : '#a0a3a6',
  }),
};

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
      styles={customStyles}
      value={selected}
      onChange={handleChange}
      isClearable="true"
      options={props.options.map(option => ({
        value: option.id,
        label: option.localized_name,
      }))}
      theme={theme => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: '#B44335',
          primary75: '#BA5447',
          primary50: '#2F363D',
          primary25: '#1B1E21',

          danger: '#B44335',
          dangerLight: '#CD5F51',

          neutral0: '#2F363D',
          neutral5: '#1B1E21',
          neutral10: '#1B1E21',
          neutral20: '#1B1E21',
          neutral30: '#1B1E21',
          neutral40: '#A0A3A6',
          neutral50: '#A0A3A6',
          neutral60: '#A0A3A6',
          neutral70: '#A0A3A6',
          neutral80: '#A0A3A6',
          neutral90: '#A0A3A6',
        },
      })}
    />
  );
}

export default HeroSelector;

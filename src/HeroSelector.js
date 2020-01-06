import React, { useState } from 'react';
import Select from 'react-select';

function HeroSelector(props) {
  const [selected, setSelected] = useState(null);

  const styles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px solid pink',
      color: state.isSelected ? 'red' : 'blue',
      padding: 100,
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: 200,
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';

      return { ...provided, opacity, transition };
    },
  };

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
    <Select
      style={styles}
      value={selected}
      onChange={handleChange}
      isClearable="true"
      menuShouldScrollIntoView="true"
      options={props.options.map(option => ({
        value: option.id,
        label: option.localized_name,
      }))}
    />
  );
}

export default HeroSelector;

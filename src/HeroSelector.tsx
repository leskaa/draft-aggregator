import React, { useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import styled from '@emotion/styled';

const DotaSelect = styled(Select)`
  padding: 0.25em;
  margin-left: 0.5em;
  margin-right: 0.5em;
  color: #a0a3a6;
`;

const customStyles: StylesConfig = {
  control: (base, state) => ({
    ...base,
    background: '#2F363D',
    height: '36px',
    minHeight: '36px',
    // match with the menu
    borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
    // Overwrittes the different states of border
    borderColor: state.isFocused ? '#545A60' : '#545A60',
    // Removes weird border around container
    boxShadow: undefined,
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

type HeroSelectorProps = {
  key: number;
  removeFromTeam: (heroId: number, team: number) => void;
  addToTeam: (heroId: number, team: number, oldHeroId: number) => void;
  team: number;
  options: Array<{ id: number; localized_name: string }>;
}

function HeroSelector(props: HeroSelectorProps) {
  const [selected, setSelected] = useState<any>(null);

  const handleChange = (option: any) => {
    if (selected && !option) {
      props.removeFromTeam(selected.value, props.team);
    } else if (selected && option) {
      props.addToTeam(option.value, props.team, selected.value);
    } else if (!selected && option) {
      props.addToTeam(option.value, props.team, -1);
    }
    setSelected(option);
  };

  return (
    <DotaSelect
      styles={customStyles}
      value={selected}
      onChange={handleChange}
      isClearable={true}
      placeholder=""
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

import React from 'react';
import Select from 'react-select';

class HeroSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      isLoading: false,
      error: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selection) {
    let team = this.props.team;
    if (selection == null) {
      this.props.removeFromTeam(this.state.selected.value, team);
    } else if (this.state.selected != null) {
      this.props.removeFromTeam(this.state.selected.value, team);
      this.props.addToTeam(selection.value, team);
    } else {
      this.props.addToTeam(selection.value, team);
    }
    this.setState({ selected: selection });
  }

  render() {
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

    return (
      <Select
        style={styles}
        value={this.state.selected}
        onChange={this.handleChange}
        isClearable="true"
        menuShouldScrollIntoView="true"
        options={this.props.options.map(option => ({
          value: option.id,
          label: option.localized_name,
        }))}
      />
    );
  }
}

export default HeroSelector;

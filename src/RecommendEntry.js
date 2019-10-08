import React from 'react';

class RecommendEntry extends React.Component {
  render() {
    return (
      <li key={this.props.heroId}>
        {this.props.name} Winrate:{' '}
        {(this.props.winrate * 100).toString().substr(0, 4)}%
      </li>
    );
  }
}

export default RecommendEntry;

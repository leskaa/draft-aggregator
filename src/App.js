import React from 'react';
import array from 'lodash/array';

import HeroSelector from './HeroSelector.js';
import RecommendPanel from './RecommendPanel.js';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      isLoading: false,
      error: null,
      allies: [],
      opponents: [],
      synergies: [],
      counters: [],
      recommendations: [],
    };
  }

  renderRecommendations = team => {
    let teamData = [...this.state.counters, ...this.state.synergies];
    // Render empty list with nothing selected
    if (teamData.length === 0) {
      this.setState({ recommendations: [] });
      return;
    }
    teamData = teamData.map(matchupSet => ({
      hero: matchupSet.hero,
      matchups: matchupSet.matchups.map(matchup => ({
        heroId: matchup.hero_id,
        winrate: matchup.winrate,
      })),
    }));
    // Remove already picked heroes from matchup data
    let pickedHeroes = [];
    this.state.allies.forEach(hero => pickedHeroes.push(hero));
    this.state.opponents.forEach(hero => pickedHeroes.push(hero));
    teamData.forEach(matchupSet => {
      matchupSet.matchups = matchupSet.matchups.filter(option => {
        return !pickedHeroes.includes(option.heroId) ? true : false;
      });
      matchupSet.matchups.sort((a, b) => (a.heroId > b.heroId ? 1 : -1));
    });
    let matchupOptions = this.state.options.filter(option => {
      return !pickedHeroes.includes(option.id) ? true : false;
    });
    // Calculate the average matchup values
    let averageTeamData = [];
    for (let i = 0; i < matchupOptions.length; i++) {
      let total = 0;
      teamData.forEach(matchupSet => {
        total += matchupSet.matchups[i].winrate;
      });
      averageTeamData.push({
        heroId: teamData[0].matchups[i].heroId,
        name: matchupOptions[i].localized_name,
        winrate: total / teamData.length,
      });
    }
    averageTeamData.sort((a, b) => (a.winrate < b.winrate ? 1 : -1));
    this.setState({ recommendations: averageTeamData });
  };

  // TODO: Improve selection option logic
  // https://stackoverflow.com/questions/26137309/remove-selected-option-from-another-select-box
  removeFromTeam = (heroId, team) => {
    console.log('remove: ' + heroId);
    if (team === '0') {
      this.setState(
        (state, props) => ({
          allies: state.allies.filter(ally => ally !== heroId),
          synergies: state.synergies.filter(
            matchupSet => matchupSet.hero !== heroId
          ),
        }),
        () => {
          this.renderRecommendations(team);
        }
      );
    } else if (team === '1') {
      this.setState(
        (state, props) => ({
          opponents: state.opponents.filter(opponent => opponent !== heroId),
          counters: state.counters.filter(
            matchupSet => matchupSet.hero !== heroId
          ),
        }),
        () => {
          this.renderRecommendations(team);
        }
      );
    }
  };

  // TODO: Add loading to deal with api delay
  addToTeam = (heroId, team) => {
    console.log('add: ' + heroId);
    if (team === '0') {
      this.setState((state, props) => ({
        allies: [...state.allies, heroId],
      }));
    } else if (team === '1') {
      this.setState((state, props) => ({
        opponents: [...state.opponents, heroId],
      }));
    }
    // TODO: Using Stratz API
    fetch(
      `https://api.stratz.com/api/v1/Hero/${heroId}/dryad?take=${this.state.options.length}&rank=5,6,7,8&matchLimit=0`
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Non-200 Response');
        }
      })
      .then(data => {
        if (team === '0') {
          const mappedMatchups = data[0].with.map(matchup => ({
            // Half the weight of counters
            hero_id: matchup.heroId2,
            winrate: 0.5 + matchup.synergy / 200,
          }));
          const uniqueMappedMatchups = array.uniqBy(mappedMatchups, 'hero_id');
          this.setState(
            (state, props) => ({
              synergies: [
                ...state.synergies,
                {
                  hero: heroId,
                  team: team,
                  matchups: uniqueMappedMatchups,
                },
              ],
            }),
            () => {
              this.renderRecommendations(team);
            }
          );
        } else if (team === '1') {
          const mappedMatchups = data[0].vs.map(matchup => ({
            hero_id: matchup.heroId2,
            winrate: 0.5 - matchup.synergy / 100,
          }));
          const uniqueMappedMatchups = array.uniqBy(mappedMatchups, 'hero_id');
          this.setState(
            (state, props) => ({
              counters: [
                ...state.counters,
                {
                  hero: heroId,
                  team: team,
                  matchups: uniqueMappedMatchups,
                },
              ],
            }),
            () => {
              this.renderRecommendations(team);
            }
          );
        }
      })
      .catch(error =>
        console.log('Stratz API matchups fetch failed: ' + error)
      );
  };

  componentDidMount() {
    // TODO: Loading animation before promise resolves
    fetch('https://api.stratz.com/api/v1/Hero')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Non-200 Response');
        }
      })
      .then(data =>
        this.setState({
          options: Object.values(data).map(option => ({
            id: option.id,
            localized_name: option.displayName,
          })),
        })
      )
      .catch(error =>
        console.log('Stratz API hero list fetch failed: ' + error)
      );
  }

  render() {
    return (
      <div className="container">
        <div className="top-right">
          <p className="team-title">Allies</p>
          <HeroSelector
            removeFromTeam={this.removeFromTeam}
            addToTeam={this.addToTeam}
            options={this.state.options}
            team="0"
          ></HeroSelector>
          <HeroSelector
            removeFromTeam={this.removeFromTeam}
            addToTeam={this.addToTeam}
            options={this.state.options}
            team="0"
          ></HeroSelector>
          <HeroSelector
            removeFromTeam={this.removeFromTeam}
            addToTeam={this.addToTeam}
            options={this.state.options}
            team="0"
          ></HeroSelector>
          <HeroSelector
            removeFromTeam={this.removeFromTeam}
            addToTeam={this.addToTeam}
            options={this.state.options}
            team="0"
          ></HeroSelector>
          <HeroSelector
            removeFromTeam={this.removeFromTeam}
            addToTeam={this.addToTeam}
            options={this.state.options}
            team="0"
          ></HeroSelector>
        </div>
        <div className="bottom-right">
          <p className="team-title">Opponents</p>
          <HeroSelector
            removeFromTeam={this.removeFromTeam}
            addToTeam={this.addToTeam}
            options={this.state.options}
            team="1"
          ></HeroSelector>
          <HeroSelector
            removeFromTeam={this.removeFromTeam}
            addToTeam={this.addToTeam}
            options={this.state.options}
            team="1"
          ></HeroSelector>
          <HeroSelector
            removeFromTeam={this.removeFromTeam}
            addToTeam={this.addToTeam}
            options={this.state.options}
            team="1"
          ></HeroSelector>
          <HeroSelector
            removeFromTeam={this.removeFromTeam}
            addToTeam={this.addToTeam}
            options={this.state.options}
            team="1"
          ></HeroSelector>
          <HeroSelector
            removeFromTeam={this.removeFromTeam}
            addToTeam={this.addToTeam}
            options={this.state.options}
            team="1"
          ></HeroSelector>
        </div>
        <div className="left">
          <RecommendPanel
            recommendations={this.state.recommendations}
          ></RecommendPanel>
        </div>
      </div>
    );
  }
}

export default App;

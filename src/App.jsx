import React, { useState, useEffect } from 'react';
import { uniqBy } from 'lodash';

import HeroSelector from './HeroSelector.js';
import RecommendPanel from './RecommendPanel.js';
import ConfigPanel from './ConfigPanel.js';

import './App.css';

function App(props) {
  const [options, setOptions] = useState([]);
  const [proPickRate, setProPickRate] = useState([]);
  const [pubPickRate, setPubPickRate] = useState([]);
  const [synergies, setSynergies] = useState([]);
  const [counters, setCounters] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [weightConfigs, setWeightConfigs] = useState([60, 20, 20]);

  useEffect(() => {
    let teamData = [...counters, ...synergies];
    // Render empty list with nothing selected
    if (teamData.length === 0) {
      setRecommendations([]);
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
    synergies.forEach(matchups => pickedHeroes.push(matchups.hero));
    counters.forEach(matchups => pickedHeroes.push(matchups.hero));
    teamData.forEach(matchupSet => {
      matchupSet.matchups = matchupSet.matchups.filter(option => {
        return !pickedHeroes.includes(option.heroId) ? true : false;
      });
      matchupSet.matchups.sort((a, b) => (a.heroId > b.heroId ? 1 : -1));
    });
    let matchupOptions = options.filter(option => {
      return !pickedHeroes.includes(option.id) ? true : false;
    });
    // Calculate the average matchup values
    let averageTeamData = [];
    const mostContestedRateHero = proPickRate.reduce((x, y) => {
      const xContested = x.picks + x.bans;
      const yContested = y.picks + y.bans;
      return xContested > yContested ? x : y;
    });
    const mostContestedRate =
      mostContestedRateHero.picks + mostContestedRateHero.bans;
    for (let i = 0; i < matchupOptions.length; i++) {
      let total = 0;
      let reasonList = [];
      if (weightConfigs[0] > 0) {
        teamData.forEach(matchupSet => {
          let team =
            counters.filter(counter => counter.hero === matchupSet.hero)
              .length > 0
              ? 'counter'
              : 'synergy';
          let winrate = matchupSet.matchups[i].winrate;
          total += winrate;
          reasonList.push({
            hero: matchupSet.hero,
            name: options.filter(option => option.id === matchupSet.hero)[0]
              .localized_name,
            team: team,
            winrate: winrate,
          });
        });
      }
      let heroPickRate = proPickRate.find(
        hero => hero.id === teamData[0].matchups[i].heroId
      );
      let contestedRate = heroPickRate.picks + heroPickRate.bans;
      let contestedPercent =
        (contestedRate / mostContestedRate - 0.5) / 3 + 0.6;
      if (contestedPercent > 0.55) {
        contestedPercent = contestedPercent - (contestedPercent - 0.55) / 1.25;
      } else if (contestedPercent < 0.45) {
        contestedPercent = contestedPercent + (0.45 - contestedPercent) / 1.25;
      }
      if (weightConfigs[1] > 0) {
        reasonList.push({
          hero: teamData[0].matchups[i].heroId,
          name: matchupOptions[i].localized_name,
          team: 'meta',
          winrate: contestedPercent,
        });
      }
      let heroWinRate = pubPickRate.find(
        hero => hero.id === teamData[0].matchups[i].heroId
      );
      heroWinRate = heroWinRate === undefined ? 0.5 : heroWinRate.winrate;
      if (weightConfigs[2] > 0) {
        reasonList.push({
          hero: teamData[0].matchups[i].heroId,
          name: matchupOptions[i].localized_name,
          team: 'pub',
          winrate: heroWinRate,
        });
      }
      averageTeamData.push({
        heroId: teamData[0].matchups[i].heroId,
        name: matchupOptions[i].localized_name,
        short_name: matchupOptions[i].short_name,
        winrate:
          ((total / teamData.length) * weightConfigs[0] +
            contestedPercent * weightConfigs[1] +
            heroWinRate * weightConfigs[2]) /
          100,
        reasonList: reasonList,
      });
    }
    averageTeamData.sort((a, b) => (a.winrate < b.winrate ? 1 : -1));
    setRecommendations(averageTeamData);
  }, [counters, options, proPickRate, pubPickRate, synergies, weightConfigs]);

  // TODO: Improve selection option logic
  // https://stackoverflow.com/questions/26137309/remove-selected-option-from-another-select-box
  const removeFromTeam = (heroId, team) => {
    if (team === '0') {
      setSynergies(synergies.filter(matchupSet => matchupSet.hero !== heroId));
    } else if (team === '1') {
      setCounters(counters.filter(matchupSet => matchupSet.hero !== heroId));
    }
  };

  // TODO: Add loading to deal with api delay
  const addToTeam = (heroId, team, oldHeroId) => {
    // TODO: Using Stratz API
    if (team === '0') {
      Promise.all([
        fetch(
          `https://api.stratz.com/api/v1/Hero/${heroId}/dryad?take=${options.length}&rank=4,5,6,7,8&matchLimit=0&week=2611`
        ).then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Non-200 Response');
          }
        }),
        fetch(
          `https://api.stratz.com/api/v1/Hero/${heroId}/dryad?take=${options.length}&rank=4,5,6,7,8&matchLimit=0`
        ).then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Non-200 Response');
          }
        }),
      ])
        .then(([currentData, oldData]) => {
          const currentWith = currentData[0].with.sort((a, b) => a.id - b.id);
          const oldWith = oldData[0].with.sort((a, b) => a.id - b.id);
          let mappedMatchups = [];
          for (let i = 0; i < currentData[0].with.length; i++) {
            mappedMatchups.push({
              hero_id: currentWith[i].heroId2,
              winrate:
                0.5 + (currentWith[i].synergy + oldWith[i].synergy) / 200,
            });
          }
          const uniqueMappedMatchups = uniqBy(mappedMatchups, 'hero_id');
          setSynergies([
            ...synergies.filter(matchupSet => matchupSet.hero !== oldHeroId),
            {
              hero: heroId,
              team: team,
              matchups: uniqueMappedMatchups,
            },
          ]);
        })
        .catch(error =>
          console.log('Stratz API matchups fetch failed: ' + error)
        );
    }

    if (team === '1') {
      fetch(`https://api.opendota.com/api/heroes/${heroId}/matchups`)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Non-200 Response');
          }
        })
        .then(counterData => {
          const data = counterData.sort((a, b) => a.hero_id - b.hero_id);
          let mappedMatchups = [];
          let index = 0;
          options.forEach(option => {
            if (data[index]?.hero_id === option.id) {
              mappedMatchups.push({
                hero_id: data[index].hero_id,
                winrate:
                  data[index].games_played > 9
                    ? (option.base_winrate -
                        data[index].wins / data[index].games_played) /
                        4 +
                      0.5
                    : 0.5,
              });
              index++;
            } else if (option.id !== heroId) {
              mappedMatchups.push({
                hero_id: option.id,
                winrate: 0.5,
              });
            }
          });
          const uniqueMappedMatchups = uniqBy(mappedMatchups, 'hero_id');
          setCounters([
            ...counters.filter(matchupSet => matchupSet.hero !== oldHeroId),
            {
              hero: heroId,
              team: team,
              matchups: uniqueMappedMatchups,
            },
          ]);
        })
        .catch(error =>
          console.log('OpenDota API matchups fetch failed: ' + error)
        );
    }
  };

  useEffect(() => {
    fetch('https://api.stratz.com/api/v1/Hero/winHour')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Non-200 Response');
        }
      })
      .then(data => {
        setPubPickRate(
          data.now.slice(0, options.length).map(hero => ({
            id: hero.heroId,
            winrate: hero.wins / hero.count,
          }))
        );
      })
      .catch(error => console.log('Stratz API winHour fetch failed: ' + error));
  }, [options.length]);

  useEffect(() => {
    fetch('https://api.opendota.com/api/heroStats')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Non-200 Response');
        }
      })
      .then(data => {
        setOptions(
          Object.values(data).map(option => ({
            id: option.id,
            localized_name: option.localized_name,
            short_name: option.name.substring(14),
            base_winrate:
              option.pro_pick > 10 ? option.pro_win / option.pro_pick : 0.5,
          }))
        );
      })
      .catch(error =>
        console.log('Stratz API hero list fetch failed: ' + error)
      );
  }, []);

  useEffect(() => {
    fetch('https://api.opendota.com/api/heroStats')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Non-200 Response');
        }
      })
      .then(data => {
        setProPickRate(
          data.map(hero => ({
            id: hero.id,
            picks: hero.pro_pick,
            bans: hero.pro_ban,
          }))
        );
      })
      .catch(error =>
        console.log('OpenDota API heroStats fetch failed: ' + error)
      );
  }, []);

  const handleConfigChange = (counterWeight, proWeight, pubWeight) => {
    setWeightConfigs([counterWeight, proWeight, pubWeight]);
  };

  return (
    <div>
      <div className="container">
        <div className="header">
          <h1>
            <span className="dota-title">Dota 2</span> Draft Strategy Tool
          </h1>
        </div>
        <div className="config">
          <p className="team-title">Configure Weights</p>
          <ConfigPanel onChange={handleConfigChange} />
        </div>
        <div className="top-right">
          <p className="team-title">Allies</p>
          {[...Array(5)].map((e, i) => (
            <HeroSelector
              key={i}
              removeFromTeam={removeFromTeam}
              addToTeam={addToTeam}
              options={options}
              team="0"
            ></HeroSelector>
          ))}
        </div>
        <div className="bottom-right">
          <p className="team-title">Opponents</p>
          {[...Array(5)].map((e, i) => (
            <HeroSelector
              key={i}
              removeFromTeam={removeFromTeam}
              addToTeam={addToTeam}
              options={options}
              team="1"
            ></HeroSelector>
          ))}
        </div>
        <div className="left">
          <RecommendPanel recommendations={recommendations}></RecommendPanel>
        </div>
        <div className="bottom-bar">
          <h3>
            © {new Date().getFullYear()}{' '}
            <a href="https://github.com/leskaa">@leskaa</a>
          </h3>
        </div>
      </div>
    </div>
  );
}

export default App;

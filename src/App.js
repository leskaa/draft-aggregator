import React, { useState, useEffect } from 'react';
import array from 'lodash/array';

import HeroSelector from './HeroSelector.js';
import RecommendPanel from './RecommendPanel.js';

import './App.css';

function App(props) {
  const [options, setOptions] = useState([]);
  const [proPickRate, setProPickRate] = useState([]);
  const [allies, setAllies] = useState([]);
  const [opponents, setOpponents] = useState([]);
  const [synergies, setSynergies] = useState([]);
  const [counters, setCounters] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

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
    allies.forEach(hero => pickedHeroes.push(hero));
    opponents.forEach(hero => pickedHeroes.push(hero));
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
      teamData.forEach(matchupSet => {
        total += matchupSet.matchups[i].winrate;
        reasonList.push({
          hero: matchupSet.hero,
          name: options.filter(option => option.id === matchupSet.hero)[0]
            .localized_name,
          team:
            counters.filter(counter => counter.hero === matchupSet.hero)
              .length > 0
              ? 'counter'
              : 'synergy',
          winrate: matchupSet.matchups[i].winrate,
        });
      });
      let heroPickRate = proPickRate.find(
        hero => hero.id === teamData[0].matchups[i].heroId
      );
      let contestedRate = heroPickRate.picks + heroPickRate.bans;
      reasonList.push({
        hero: teamData[0].matchups[i].heroId,
        name: matchupOptions[i].localized_name,
        team: 'meta',
        winrate: Math.pow(contestedRate / mostContestedRate - 0.5, 3) + 0.55,
      });
      averageTeamData.push({
        heroId: teamData[0].matchups[i].heroId,
        name: matchupOptions[i].localized_name,
        short_name: matchupOptions[i].short_name,
        winrate:
          ((total / teamData.length) * 4 +
            (Math.pow(contestedRate / mostContestedRate - 0.5, 3) + 0.55)) /
          5,
        reasonList: reasonList,
      });
    }
    averageTeamData.sort((a, b) => (a.winrate < b.winrate ? 1 : -1));
    setRecommendations(averageTeamData);
  }, [allies, counters, opponents, options, proPickRate, synergies]);

  // TODO: Improve selection option logic
  // https://stackoverflow.com/questions/26137309/remove-selected-option-from-another-select-box
  const removeFromTeam = (heroId, team) => {
    if (team === '0') {
      setAllies(allies.filter(ally => ally !== heroId));
      setSynergies(synergies.filter(matchupSet => matchupSet.hero !== heroId));
    } else if (team === '1') {
      setOpponents(opponents.filter(opponent => opponent !== heroId));
      setCounters(counters.filter(matchupSet => matchupSet.hero !== heroId));
    }
  };

  // TODO: Add loading to deal with api delay
  const addToTeam = (heroId, team) => {
    if (team === '0') {
      setAllies([...allies, heroId]);
    } else if (team === '1') {
      setOpponents([...opponents, heroId]);
    }
    // TODO: Using Stratz API
    fetch(
      `https://api.stratz.com/api/v1/Hero/${heroId}/dryad?take=${options.length}&rank=0,1,2,3,4,5,6,7,8&matchLimit=0`
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
            winrate: 0.5 + matchup.synergy / 100,
          }));
          const uniqueMappedMatchups = array.uniqBy(mappedMatchups, 'hero_id');
          setSynergies([
            ...synergies,
            {
              hero: heroId,
              team: team,
              matchups: uniqueMappedMatchups,
            },
          ]);
        } else if (team === '1') {
          const mappedMatchups = data[0].vs.map(matchup => ({
            hero_id: matchup.heroId2,
            winrate: 0.5 - matchup.synergy / 100,
          }));
          const uniqueMappedMatchups = array.uniqBy(mappedMatchups, 'hero_id');
          setCounters([
            ...counters,
            {
              hero: heroId,
              team: team,
              matchups: uniqueMappedMatchups,
            },
          ]);
        }
      })
      .catch(error =>
        console.log('Stratz API matchups fetch failed: ' + error)
      );
  };

  useEffect(() => {
    fetch('https://api.stratz.com/api/v1/Hero')
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
            localized_name: option.displayName,
            short_name: option.shortName,
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

  return (
    <div>
      <div className="header">
        <h1>
          <span className="dota-title">Dota 2</span> Draft Strategy Tool
        </h1>
      </div>
      <div className="container">
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
      </div>
    </div>
  );
}

export default App;

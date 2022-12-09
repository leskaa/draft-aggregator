import React, { useState, useEffect } from 'react'

import {
  OpenDotaHeroStats,
  Option,
  ProPickRate,
  PubWinRate,
  MatchupSet,
  StratzDryad,
  Recommendation
} from './types'
import HeroSelector from './HeroSelector'
import RecommendPanel from './RecommendPanel'
import ConfigPanel from './ConfigPanel'

import './App.css'

function App() {
  const [options, setOptions] = useState<Option[]>([])
  const [proPickRate, setProPickRate] = useState<ProPickRate[]>([])
  const [pubWinRate, setPubWinRate] = useState<PubWinRate[]>([])
  const [synergies, setSynergies] = useState<MatchupSet[]>([])
  const [counters, setCounters] = useState<MatchupSet[]>([])
  const [weightConfigs, setWeightConfigs] = useState<number[]>([40, 20, 20, 20])

  const averageProContestedRate =
    proPickRate.reduce((acc, cur) => acc + cur.picks + cur.bans, 0) /
    proPickRate.length

  let recommendations: Recommendation[] = []

  const teamData: MatchupSet[] = [...counters, ...synergies]

  if (teamData.length !== 0) {
    recommendations = options
      .filter((option) => {
        return !teamData.some(
          (matchupSet) => matchupSet.heroId === option.heroId
        )
      })
      .map((option) => ({
        heroId: option.heroId,
        name: option.localized_name,
        short_name: option.short_name,
        winrate: option.base_winrate,
        reasonList: [
          { heroId: 0, name: 'Anti-Mage', team: 'Synergy', winrate: 0.5 }
        ]
      }))
  }

  // TODO: Improve selection option logic
  // https://stackoverflow.com/questions/26137309/remove-selected-option-from-another-select-box
  const removeFromTeam = (heroId: number, team: number) => {
    if (team === 0) {
      setSynergies(
        synergies.filter((matchupSet) => matchupSet.heroId !== heroId)
      )
    } else if (team === 1) {
      setCounters(counters.filter((matchupSet) => matchupSet.heroId !== heroId))
    }
  }

  // TODO: Add loading to deal with api delay
  const addToTeam = (heroId: number, team: number, oldHeroId: number) => {
    // TODO: Using Stratz API
    fetch(`http://localhost:9999/.netlify/functions/matchups/${heroId}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Non-200 Response')
        }
      })
      .then((data) => {
        const synergyData = data.heroStats.matchUp[0].with
        const counterData = data.heroStats.matchUp[0].vs
        if (team === 0) {
          setCounters([
            ...counters.filter((matchupSet) => matchupSet.heroId !== oldHeroId),
            {
              heroId: heroId,
              team: team,
              matchups: counterData.map((stratzDryad: StratzDryad) => ({
                heroId: stratzDryad.heroId2,
                winrate: stratzDryad.winCount / stratzDryad.matchCount
              }))
            }
          ])
        }
        if (team === 1) {
          setSynergies([
            ...synergies.filter(
              (matchupSet) => matchupSet.heroId !== oldHeroId
            ),
            {
              heroId: heroId,
              team: team,
              matchups: synergyData.map((stratzDryad: StratzDryad) => ({
                heroId: stratzDryad.heroId2,
                winrate: stratzDryad.winCount / stratzDryad.matchCount
              }))
            }
          ])
        }
      })
      .catch((error) => console.log('Netlify matchups fetch failed: ' + error))
  }

  useEffect(() => {
    fetch('https://api.opendota.com/api/heroStats')
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Non-200 Response')
        }
      })
      .then((data: OpenDotaHeroStats[]) => {
        setOptions(
          Object.values(data).map((openDotaHeroStats: OpenDotaHeroStats) => ({
            heroId: openDotaHeroStats.id,
            localized_name: openDotaHeroStats.localized_name,
            short_name: openDotaHeroStats.name.substring(14),
            base_winrate:
              openDotaHeroStats.pro_pick > 10
                ? openDotaHeroStats.pro_win / openDotaHeroStats.pro_pick
                : 0.5
          }))
        )
        setProPickRate(
          data.map((openDotaHeroStats: OpenDotaHeroStats) => ({
            heroId: openDotaHeroStats.id,
            picks: openDotaHeroStats.pro_pick,
            bans: openDotaHeroStats.pro_ban
          }))
        )
        setPubWinRate(
          data.map((openDotaHeroStats: OpenDotaHeroStats) => {
            const {
              id: heroId,
              '8_win': immortalWins,
              '7_win': divineWins,
              '6_win': ancientWins,
              '5_win': legendWins,
              '8_pick': immortalPicks,
              '7_pick': divinePicks,
              '6_pick': ancientPicks,
              '5_pick': legendPicks
            } = openDotaHeroStats
            return {
              heroId,
              winrate:
                (immortalWins + divineWins + ancientWins + legendWins) /
                (immortalPicks + divinePicks + ancientPicks + legendPicks)
            }
          })
        )
      })
      .catch((error) =>
        console.log('OpenDota API heroStats fetch failed: ' + error)
      )
  }, [])

  const handleConfigChange = (
    counterWeight: number,
    synergyWeight: number,
    proWeight: number,
    pubWeight: number
  ) => {
    setWeightConfigs([counterWeight, synergyWeight, proWeight, pubWeight])
  }

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
              team={0}
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
              team={1}
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
  )
}

export default App

import create from 'zustand'

export interface SelectedHero {
  id: number
  name: string
}

interface SelectedHeroState {
  selectedHeroes: SelectedHero[]
  addHero: (hero: SelectedHero) => void
  removeHero: (hero: SelectedHero) => void
}

const useSelectedHeroStore = create<SelectedHeroState>((set) => ({
  selectedHeroes: [],
  addHero: (hero: SelectedHero) =>
    set((state) => ({ selectedHeroes: [...state.selectedHeroes, hero] })),
  removeHero: (hero: SelectedHero) =>
    set((state) => ({
      selectedHeroes: state.selectedHeroes.filter((h) => h.id !== hero.id)
    }))
}))

export default useSelectedHeroStore

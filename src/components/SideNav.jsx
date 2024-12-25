import { first151Pokemon, getFullPokedexNumber } from "../utils"
import { useState } from "react"

export function SideNav(props){

    const { selectedPokemon, setSelectedPokemon, handleCloseMenu, showSideNav } = props

    const [searchValue, setSearchValue] = useState('')

    const filteredPokemon = first151Pokemon.filter((pokemon, pokemonIndex) => {
        if(getFullPokedexNumber(pokemonIndex).includes(searchValue)){
            return true
        }

        if(pokemon.toLowerCase().includes(searchValue.toLowerCase())){
            return true
        }

        return false
    })

  return (
    <nav className={' ' + (!showSideNav ? "open" : '') + " scroll"}>
        <div className={"header " + (!showSideNav ? "open" : '')}>

            <button onClick={handleCloseMenu} className="open-nav-button">
                <i className="fa-solid fa-arrow-left" onClick={handleCloseMenu}></i>
            </button>
            <h1 className="text-gradient">Pokedéx</h1>
        </div>
        <input placeholder="E.g 001 or Bulba.." value={searchValue} onChange={(event) =>{
            setSearchValue(event.target.value)
        }}/>
        {filteredPokemon.map((pokemon, pokemonIndex) => {
            const truePokemonIndex = first151Pokemon.indexOf(pokemon)
            return (
                <button onClick={() => {
                    setSelectedPokemon(truePokemonIndex)
                    handleCloseMenu()
                }} key={pokemonIndex} className={'nav-card' + (pokemonIndex === selectedPokemon ? 'nav-card-selected' : ' ')}>
                    <p>{getFullPokedexNumber(truePokemonIndex)}</p>
                    <p>{pokemon}</p>
                </button>
            )
        })}
    </nav>
  )
}
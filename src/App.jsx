import { Header } from "./components/Header"
import { PokeCard } from "./components/PokeCard"
import { SideNav } from "./components/SideNav"

import { useState } from "react"

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0)

  const [showSideNav, setShowSideNav] = useState(true)

  function handleToggleMenu(){
    setShowSideNav(!showSideNav)
  }

  function handleCloseMenu(){
    setShowSideNav(true)
  }

  return (
    <>
      <Header handleToggleMenu = {handleToggleMenu}/>

      <SideNav 
        showSideNav={showSideNav} 
        handleToggleMenu = {handleToggleMenu} 
        selectedPokemon={selectedPokemon} 
        setSelectedPokemon={setSelectedPokemon}
        handleCloseMenu={handleCloseMenu} />

      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  )
}

export default App

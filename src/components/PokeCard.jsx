import { useEffect } from "react"
import { useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import { TypeCard } from "./TypeCard";
import Modal from "./Modal";

export function PokeCard(props){
    const { selectedPokemon } = props;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [skill, setSkill] = useState(null);
    const [loadingSkill, setLoadingSkill] = useState(false);

    const {name, height, abilities, stats, types, moves, sprites} = data || {};

    const imgList = Object.keys(sprites || {}).filter(val => {
        if(!sprites[val]){ return false }
        if(['versions', 'other'].includes(val)){ return false }
        return true
    })

    async function fetchMoveData(move, moveUrl){
        if(loadingSkill || !moveUrl || !localStorage){ return }
        
        let c = {};
        if(localStorage.getItem('pokemon-moves')){
            c = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if(move in c){
            setSkill(c[move])
            console.log('Move cached')
            return
        }

        try{
            setLoadingSkill(true)
            const response = await fetch(moveUrl)
            const data = await response.json()
            console.log('Move fetched')

            const description = data?.flavor_text_entries.filter(val =>{
                return val.version_group.name = 'firered-leafgreen'
            })[0]?.flavor_text

            const skillData ={
                name :move,
                description
            }
            setSkill(skillData)
            c[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(c))
        }
        catch(error){
            console.error(error.message)
        }
        finally{
            setLoadingSkill(false)
        }
    }

    useEffect(() => {

        if(loading || !localStorage) { return }

        let cache = {};
        if(localStorage.getItem('pokedex')){
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }

        if(selectedPokemon in cache){
            setData(cache[selectedPokemon])
            console.log('Pokemon cached')
            return
        }

        async function fetchPokemonData(){
            setLoading(true)
            try{
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${getPokedexNumber(selectedPokemon)}`)
                const data = await response.json()
                setData(data)
                console.log('Pokemon fetched')

                cache[selectedPokemon] = data
                localStorage.setItem('pokedex', JSON.stringify(cache))

            }
            catch(error){
                console.error(error.message)
            } 
            finally{
                setLoading(false)
            }
        }

        fetchPokemonData()

    },[selectedPokemon]) 

    if(loading || !data){
        return <h4>Loading...</h4>
    }

    return (
        <div className="poke-card">
            {skill && (
                <Modal handleCloseModal={() => { setSkill(null) }}>
                    <div>
                        <h6>Name</h6>
                        <h2 className="skill-name">{skill.name.replaceAll('-', ' ')}</h2>
                    </div>
                    <div>
                        <h6>Description</h6>
                        <p>{skill.description}</p>
                    </div>
                </Modal>
            )}
            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name}/>
                    )
                })}
            </div>
            <img className="default-img" src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} alt={`${name}-large-img`} />
            <div className="img-container">
                {imgList.map((img, imgIndex) => {
                    return (
                        <img key={imgIndex} src={sprites[img]} alt={`${name}-${img}`} />
                    )
                })}
            </div>
            <h3>Stats</h3>
            <div className="stats-card">
                {stats.map((statObj, statIndex) => {
                    return (
                        <div key={statIndex} className="stat-item">
                            <p>{statObj.stat?.name.replaceAll('-' , ' ')}</p>
                            <h4>{statObj.base_stat}</h4>
                        </div>
                    )
                })}
            </div>
            <h3>Moves</h3>
            <div className="pokemon-move-grid">
                {moves.map((moveObj, moveIndex) => {
                    return (
                        <button className="button-card pokemon-move" key={moveIndex} onClick={() => {
                            fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
                        }}>
                            <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                        </button>
                    )
                })}
            </div>

        </div>
    )
}
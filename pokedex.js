const baseUrl = "https://pokeapi.co/api/v2/pokemon/?&limit=150";
const colorsUrl = "https://pokeapi.co/api/v2/pokemon-color";
const habitatsUrl = "https://pokeapi.co/api/v2/pokemon-habitat";

const olPokedex$$ = document.querySelector("#pokedex");
const divFilterTyp$$ = document.querySelector("#filter");
const inputSearch$$ = document.querySelector(".b-input");
const buttonClear$$ = document.querySelector(".b-buttonClear");
const dropDown$$ = document.querySelector(".b-filtersDropdwn");
const filterColor$$ = document.querySelector("#filterColor");

const init = async () => {
    const res = await fetch(baseUrl);
    const resJson = await res.json();
    
    let pokemonsList = [];
    for (const pokm of resJson.results) {
        const resPk = await fetch (pokm.url);
        const resPkJson = await resPk.json();
        pokemonsList.push(resPkJson);
    }

    const pokemons = createPokemonObj(pokemonsList);

    // get colors and its species
    try { 
        const resColor = await fetch (colorsUrl);
        const resColorJson = await resColor.json();
        for (const color of resColorJson.results) {
            const resColorPkm = await fetch (color.url);
            const resColorPkmJson = await resColorPkm.json();
            printAddColors("color", color, resColorPkmJson, pokemons);
        }
    } catch (error) {
        console.log(error);
    }


    // get habitats and its species
    try { 
        const resHabit = await fetch (habitatsUrl);
        const resHabitJson = await resHabit.json();
        for (const habit of resHabitJson.results) {
            const resHabitPkm = await fetch (habit.url);
            const resHabitPkmJson = await resHabitPkm.json();
            printAddColors("habitat", habit, resHabitPkmJson, pokemons);
        }
    } catch (error) {
        console.log(error);
    }

    dropDown$$.addEventListener("change", () => {
        const typFilter = event.target.value;
        if (typFilter === "type") {
            printPropFilter(typFilter, pokemons); 

        } else if (typFilter === "habitat") {
            printPropFilter(typFilter, pokemons); 

        }
    });
    inputSearch$$.addEventListener("input", () => {
        handlerInputSearch(pokemons)
    });

    printPropFilter("type", pokemons); 
    printPokemon(pokemons);

    buttonClear$$.addEventListener("click", () => {
        printPokemon(pokemons);

    });
}
const createPokemonObj = (pokemonsList) => {
    const pokemons = pokemonsList.map((result) => ({
        name: result.name,
        image: result.sprites.front_default,
        abilities: result.abilities.map((type) => type.ability.name).join(", "),
        type: result.types.map((type) => type.type.name).join(", "),
        id: result.id,
        height : result.height,
        weight: result.weight,
        })
        );
    return pokemons;
}
const printAddColors = (propName, prop, resColorPkmJson, pokemons) => {

    pkmSpecies = resColorPkmJson.pokemon_species.map((specie) => specie.name);

    for (const pkm of pokemons) {
        if (pkmSpecies.includes(pkm.name)) {
            console.log(prop);
            pkm[propName] = prop.name;
        }
    }

    //add filter div
    const colordiv$$ = document.createElement("div");
    colordiv$$.classList.add("b-colorpoint");
    colordiv$$.style.backgroundColor = prop.name;
    filterColor$$.appendChild(colordiv$$);

    filterColor$$.addEventListener("click", () => {
        handlerClickColor(pokemons);
    });
}

printPokemon = (pokemons) => {
    olPokedex$$.innerHTML = "";
    for (const pokem of pokemons) {
        const divPokemon$$ = document.createElement("li");
        divPokemon$$.classList.add("b-pokemon");
        divPokemon$$.style.borderColor = pokem.color;
        divPokemon$$.innerHTML = `<div class=""># ${pokem.id}</div>
                                    <img src="${pokem.image}" alt="" class="">
                                    <h2 class="">${pokem.name}</h2>
                                    <h3 class="">${pokem.type}</h3>`
        olPokedex$$.appendChild(divPokemon$$)
    }
}

const printPropFilter = (propName, pokemons) => {
    console.log(pokemons);
    divFilterTyp$$.innerHTML = "";
    const typesPkm = pokemons.map((item) => (
            item[propName].split(", ")
        ));

    const typesPkmUniq = new Set(typesPkm.flat());
    
    for(let typ of typesPkmUniq) {
        let typButt$$ = document.createElement("button");
        typButt$$.classList.add("b-button");
        typButt$$.textContent = typ;
        divFilterTyp$$.appendChild(typButt$$);

        typButt$$.addEventListener("click", () => {handlerClickType(propName, pokemons)});

    }  
    
}

const handlerClickColor = (pokemons) => {
    const colorDiv = event.target.style.backgroundColor;
    pokemonsFiltered = pokemons.filter((pokem) => pokem.color.includes(colorDiv));
    printPokemon(pokemonsFiltered);
}

const handlerClickClear = (pokemons) => {
    printPokemon(pokemons);
}

const handlerInputSearch = (pokemons) => {
    const inputText = event.target.value;
    console.log(inputText);
    pokemonsFiltered = pokemons.filter((pokem) => pokem.name.toLowerCase().includes(inputText.toLowerCase()))
    console.log(pokemonsFiltered);
    printPokemon(pokemonsFiltered);
}

const handlerClickType = (propName, pokemons) => {
    let propValName = event.target.innerHTML;
    console.log(propValName);
    pokemonsFiltered = pokemons.filter((pokem) => pokem[propName].includes(propValName))
    console.log(pokemonsFiltered);
    printPokemon(pokemonsFiltered);
}

init();

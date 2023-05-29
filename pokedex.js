const baseUrl = "https://pokeapi.co/api/v2/pokemon/?&limit=150";
const colorsUrl = "https://pokeapi.co/api/v2/pokemon-color";
const habitatsUrl = "https://pokeapi.co/api/v2/pokemon-habitat";

const olPokedex$$ = document.querySelector("#pokedex");
const divFilterTyp$$ = document.querySelector("#filterText");
const inputSearch$$ = document.querySelector(".b-input__bar");
const buttonClear$$ = document.querySelector("#buttonClear");
const dropDown$$ = document.querySelector(".b-filtersDropdwn");
const filterColor$$ = document.querySelector("#filterColor");
const modal$$ = document.querySelector(".b-modal-hidden");
const overlay$$ = document.querySelector(".b-overlay-hidden");
let pokemonsFiltered = [];

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
    pokemonsFiltered = pokemons;

    // get colors and their species
    try { 
        const resColor = await fetch (colorsUrl);
        const resColorJson = await resColor.json();
        console.log(resColorJson);
        for (const color of resColorJson.results) {
            const resColorPkm = await fetch (color.url);
            const resColorPkmJson = await resColorPkm.json();
            console.log(color);
            addProperty("color", color, resColorPkmJson, pokemons);
            printColors(color, pokemons);
        }
    } catch (error) {
        console.log(error);
    }


    // get habitats and their species
    try { 
        const resHabit = await fetch (habitatsUrl);
        const resHabitJson = await resHabit.json();
        for (const habit of resHabitJson.results) {
            const resHabitPkm = await fetch (habit.url);
            const resHabitPkmJson = await resHabitPkm.json();
            addProperty("habitat", habit, resHabitPkmJson, pokemons);
        }
    } catch (error) {
        console.log(error);
    }

    // print filters when clicking in dropdown
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

    // clear filter button
    buttonClear$$.addEventListener("click", () => {
        printPokemon(pokemons);
        printPropFilter("type", pokemons); 
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
const addProperty = (propName, prop, resColorPkmJson, pokemons) => {
    // add pokemon property to pokemon object (color or habitat)
    pkmSpecies = resColorPkmJson.pokemon_species.map((specie) => specie.name);

    for (const pkm of pokemons) {
        if (pkmSpecies.includes(pkm.name)) {
            //console.log(prop);
            pkm[propName] = prop.name;
        }
    }
}

const printColors = (prop, pokemons) => {
    // print color filter
    //add filter div
    const colordiv$$ = document.createElement("div");
    colordiv$$.classList.add("b-filter__colorPoint");
    colordiv$$.style.backgroundColor = prop.name;
    filterColor$$.appendChild(colordiv$$);

    filterColor$$.addEventListener("click", () => {
        handlerClickColor(pokemons);
    });
}

const printPokemon = (pokemons) => {
    olPokedex$$.innerHTML = "";

    addTransition(olPokedex$$);
    
    for (const pokem of pokemons) {
        const divPokemon$$ = document.createElement("li");
        divPokemon$$.classList.add("b-gallery__pokemon");
        divPokemon$$.style.borderColor = pokem.color;
        console.log(divPokemon$$.style.background);
        //divPokemon$$.style.backgroundColor = pokem.color;
        divPokemon$$.innerHTML = `<div class="b-gallery__Pkmnumber"># ${pokem.id}</div>
                                    <img src="${pokem.image}" alt="" class="">
                                    <h2 class="">${pokem.name}</h2>
                                    <h3 class="b-gallery__PkmType">${pokem.type}</h3>`
        olPokedex$$.appendChild(divPokemon$$)

        divPokemon$$.addEventListener("click", () => openModalPkm(pokem))
    }
}

const printPropFilter = (propName, pokemons) => {

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

        typButt$$.addEventListener("click", () => {
            typButt$$.style.backgroundColor = "grey";
            handlerClickType( typButt$$, propName)
        });

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

const handlerClickType = (typButt$$, propName) => {
    let propValName = event.target.innerHTML;
    console.log(propValName);
    pokemonsFiltered = pokemonsFiltered.filter((pokem) => pokem[propName].includes(propValName))
    printPokemon(pokemonsFiltered);
    typButt$$.addEventListener("click", () => {
        typButt$$.style.backgroundColor = "grey";
        handlerClickType( typButt$$, propName, pokemonsFiltered);
    });
}

// hide modal and overlay
window.onclick = function(event) {
    if (event.target == overlay$$) {
        overlay$$.style.display = "none";
        modal$$.style.display = "none";
    }
  }

const addTransition = (div$$) => {
    div$$.classList.add("b-transition")
setTimeout(() => {
    div$$.classList.remove("b-transition")
}, 1000)
}

const openModalPkm = (pokem) => {
    addTransition(modal$$);

    modal$$.style.display = "flex";
    modal$$.style.borderColor = pokem.color;
    overlay$$.style.display = "flex";
    modal$$.innerHTML = `<h3 class="b-gallery__label">Weight</h3>
                        <h4 class="">${pokem.weight} Kg</h4>
                        <h3 class="b-gallery__label">Height</h3>
                        <h4 class="">${pokem.height} cms</h4>
                        <h3 class="b-gallery__label">Abilities</h3>
                        <h4 class="">${pokem.abilities}</h4>`
}


init();

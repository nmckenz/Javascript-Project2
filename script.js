const pokeballer = {};

pokeballer.baseUrlBDI = "https://www.balldontlie.io/api/v1"
pokeballer.baseUrlPoke = "https://pokeapi.co/api/v2"

const $teamSelect = $("#teamSelect")
const $playerSearchForm = $("#playerSearchForm")
const $playerSearchSelect = $("#playerSearchSelect")

let bestStatById = 0;


pokeballer.getAllPlayerStats = () => {
    const allPlayerStats = pokeballer.getBDIData(`stats?seasons[]=2018&postseason=false&per_page=100`)
    allPlayerStats.then((allStats) => {
        console.log("all stats", allStats)

    })
}

pokeballer.getPlayerSelectValue = () => {
    $("#playerSearchSelect").change(() => {
        const selection = $("option:selected").val();
        console.log("player id", selection);
        $("#playerSearchForm")[0].reset();


        const player2018Stats = pokeballer.getBDIData(`stats?seasons[]=2018&player_ids[]=${selection}&postseason=false&per_page=100`)
        player2018Stats.then((playerStats) => {
            console.log("chosenPlayer2018Stats", playerStats)
            console.log("chosenPlayer2018Stats.data", playerStats.data)

            const playerStatsArray = playerStats.data
            if (playerStatsArray.length === 0) {
                alert("Oh no, stats aren't available for that player. Please choose another baller!")
            } else {
                const playerBio = playerStatsArray[0].player
                console.log("player bio", playerBio)
                $(".playerName").html(`${playerBio.first_name} ${playerBio.last_name}`)
                $(".playerPosition").html(`Position: ${playerBio.position}`)
                $(".pokemonDiv").html(`<h4><span class="capitalize">if</span> ${playerBio.first_name} ${playerBio.last_name} was a <span class="capitalize">pokemon</span>, he would be:</h4>`)

                const pointsAvg = pokeballer.getPlayerPointsAvg(playerStatsArray);
                const assistAvg = pokeballer.getPlayerAssistAvg(playerStatsArray);
                const reboundAvg = pokeballer.getPlayerReboundAvg(playerStatsArray);
                const stealsAvg = pokeballer.getPlayerStealsAvg(playerStatsArray);
                const blocksAvg = pokeballer.getPlayerBlocksAvg(playerStatsArray);
                const foulsAvg = pokeballer.getPlayerFoulsAvg(playerStatsArray)
                const turnoverAvg = pokeballer.getPlayerTurnoverAvg(playerStatsArray);
                const ftaAvg = pokeballer.getPlayerFTAAvg(playerStatsArray)

                $(".pts").html(`
                    <h5 class="category">pts</h5>
                    <h5 class="value">${pointsAvg}</h5>
                `)
                $(".ast").html(`
                    <h5 class="category">ast</h5>
                    <h5 class="value">${assistAvg}</h5>
                `)
                $(".reb").html(`
                    <h5 class="category">reb</h5>
                    <h5 class="value">${reboundAvg}</h5>
                `)
                $(".stl").html(`
                    <h5 class="category">stl</h5>
                    <h5 class="value">${stealsAvg}</h5>
                `)
                $(".blk").html(`
                    <h5 class="category">blk</h5>
                    <h5 class="value">${blocksAvg}</h5>
                `)
                $(".pf").html(`
                    <h5 class="category">pf</h5>
                    <h5 class="value">${foulsAvg}</h5>
                `)
                $(".to").html(`
                    <h5 class="category">to</h5>
                    <h5 class="value">${turnoverAvg}</h5>
                `)
                $(".fta").html(`
                    <h5 class="category">fta</h5>
                    <h5 class="value">${ftaAvg}</h5>
                `)

                $("#statsSection").removeClass("hidden")
                $("#getPokemonButton").removeClass("hidden")

                pokeballer.bestStat = () => {
                    if (pointsAvg > 21.1) {
                        return 1
                    } else if (assistAvg > 5.5) {
                        return 2
                    } else if (reboundAvg > 8.2) {
                        if (blocksAvg > 2) {
                            return 5
                        }
                        return 3
                    } else if (stealsAvg > 1.4) {
                        return 4
                    } else if (blocksAvg > 1.1) {
                        return 5
                    } else if (foulsAvg > 2.9) {
                        return 6
                    } else if (turnoverAvg > 2.6) {
                        return 7
                    } else if (ftaAvg < 1) {
                        return 8
                    } else {
                        return 9
                    }
                }

                bestStatById = pokeballer.bestStat()
                console.log("best stat by id", bestStatById)
            }
            
        })
    });
};




// -------------------------------
// STATS CALCULATION FUNCTIONS
pokeballer.getPlayerPointsAvg = (allStatsArray) => {
    const seasonPointsArray = allStatsArray.map((value) => {
        return value.pts
    })
    // console.log("seasonPoints by function", seasonPointsArray)
    let seasonPointsTotal = 0
    let dnpCounter = 0
    for (let i = 0; i < seasonPointsArray.length; i++) {
        if (seasonPointsArray[i] === null) {
            dnpCounter++
        }
        seasonPointsTotal += seasonPointsArray[i]
    }
    // console.log("seasonPointsTotal", seasonPointsTotal)
    // console.log("dnpCounter", dnpCounter)
    const seasonPointsAvg = (seasonPointsTotal / (seasonPointsArray.length - dnpCounter)).toFixed(1)
    console.log("seasonPointsAvg", seasonPointsAvg)
   
    return seasonPointsAvg
}

pokeballer.getPlayerAssistAvg = (allStatsArray) => {
    const seasonAssistArray = allStatsArray.map((value) => {
        return value.ast
    })
    // console.log("seasonAssist by function", seasonAssistArray)
    let seasonAssistTotal = 0
    let dnpCounter = 0
    for (let i = 0; i < seasonAssistArray.length; i++) {
        if (seasonAssistArray[i] === null) {
            dnpCounter++
        }
        seasonAssistTotal += seasonAssistArray[i]
    }
    // console.log("seasonAssistTotal", seasonAssistTotal)
    // console.log("dnpCounter", dnpCounter)
    const seasonAssistAvg = (seasonAssistTotal / (seasonAssistArray.length - dnpCounter)).toFixed(1)
    console.log("seasonAssistAvg", seasonAssistAvg)
    
    return seasonAssistAvg
}

pokeballer.getPlayerReboundAvg = (allStatsArray) => {
    const seasonReboundArray = allStatsArray.map((value) => {
        return value.reb
    })
    // console.log("seasonRebound by function", seasonReboundArray)
    let seasonReboundTotal = 0
    let dnpCounter = 0
    for (let i = 0; i < seasonReboundArray.length; i++) {
        if (seasonReboundArray[i] === null) {
            dnpCounter++
        }
        seasonReboundTotal += seasonReboundArray[i]
    }
    // console.log("seasonReboundTotal", seasonReboundTotal)
    // console.log("dnpCounter", dnpCounter)
    const seasonReboundAvg = (seasonReboundTotal / (seasonReboundArray.length - dnpCounter)).toFixed(1)
    console.log("seasonReboundAvg", seasonReboundAvg)
    
    return seasonReboundAvg
}

pokeballer.getPlayerStealsAvg = (allStatsArray) => {
    const seasonStealsArray = allStatsArray.map((value) => {
        return value.stl
    })
    // console.log("seasonSteals by function", seasonStealsArray)
    let seasonStealsTotal = 0
    let dnpCounter = 0
    for (let i = 0; i < seasonStealsArray.length; i++) {
        if (seasonStealsArray[i] === null) {
            dnpCounter++
        }
        seasonStealsTotal += seasonStealsArray[i]
    }
    // console.log("seasonStealsTotal", seasonStealsTotal)
    // console.log("dnpCounter", dnpCounter)
    const seasonStealsAvg = (seasonStealsTotal / (seasonStealsArray.length - dnpCounter)).toFixed(1)
    console.log("seasonStealsAvg", seasonStealsAvg)
    
    return seasonStealsAvg
}

pokeballer.getPlayerFoulsAvg = (allStatsArray) => {
    const seasonFoulsArray = allStatsArray.map((value) => {
        return value.pf
    })
    // console.log("seasonFouls by function", seasonFoulsArray)
    let seasonFoulsTotal = 0
    let dnpCounter = 0
    for (let i = 0; i < seasonFoulsArray.length; i++) {
        if (seasonFoulsArray[i] === null) {
            dnpCounter++
        }
        seasonFoulsTotal += seasonFoulsArray[i]
    }
    // console.log("seasonFoulsTotal", seasonFoulsTotal)
    // console.log("dnpCounter", dnpCounter)
    const seasonFoulsAvg = (seasonFoulsTotal / (seasonFoulsArray.length - dnpCounter)).toFixed(1)
    console.log("seasonFoulsAvg", seasonFoulsAvg)
    
    return seasonFoulsAvg
}

pokeballer.getPlayerTurnoverAvg = (allStatsArray) => {
    const seasonTurnoverArray = allStatsArray.map((value) => {
        return value.turnover
    })
    // console.log("seasonTurnover by function", seasonTurnoverArray)
    let seasonTurnoverTotal = 0
    let dnpCounter = 0
    for (let i = 0; i < seasonTurnoverArray.length; i++) {
        if (seasonTurnoverArray[i] === null) {
            dnpCounter++
        }
        seasonTurnoverTotal += seasonTurnoverArray[i]
    }
    // console.log("seasonTurnoverTotal", seasonTurnoverTotal)
    // console.log("dnpCounter", dnpCounter)
    const seasonTurnoverAvg = (seasonTurnoverTotal / (seasonTurnoverArray.length - dnpCounter)).toFixed(1)
    console.log("seasonTurnoverAvg", seasonTurnoverAvg)
    
    return seasonTurnoverAvg
}

pokeballer.getPlayerBlocksAvg = (allStatsArray) => {
    const seasonBlocksArray = allStatsArray.map((value) => {
        return value.blk
    })
    // console.log("seasonBlocks by function", seasonBlocksArray)
    let seasonBlocksTotal = 0
    let dnpCounter = 0
    for (let i = 0; i < seasonBlocksArray.length; i++) {
        if (seasonBlocksArray[i] === null) {
            dnpCounter++
        }
        seasonBlocksTotal += seasonBlocksArray[i]
    }
    // console.log("seasonBlocksTotal", seasonBlocksTotal)
    // console.log("dnpCounter", dnpCounter)
    const seasonBlocksAvg = (seasonBlocksTotal / (seasonBlocksArray.length - dnpCounter)).toFixed(1)
    console.log("seasonBlocksAvg", seasonBlocksAvg)
    
    return seasonBlocksAvg
}

pokeballer.getPlayerFTAAvg = (allStatsArray) => {
    const seasonFTAArray = allStatsArray.map((value) => {
        return value.fta
    })
    // console.log("seasonFTA by function", seasonFTAArray)
    let seasonFTATotal = 0
    let dnpCounter = 0
    for (let i = 0; i < seasonFTAArray.length; i++) {
        if (seasonFTAArray[i] === null) {
            dnpCounter++
        }
        seasonFTATotal += seasonFTAArray[i]
    }
    // console.log("seasonFTATotal", seasonFTATotal)
    // console.log("dnpCounter", dnpCounter)
    const seasonFTAAvg = (seasonFTATotal / (seasonFTAArray.length - dnpCounter)).toFixed(1)
    console.log("seasonFTAAvg", seasonFTAAvg)
    
    return seasonFTAAvg
}
// ---------------------------------







// ------------------------------
// TRYING TO MAKE A GENERIC STAT CALCULATOR
pokeballer.getPlayerStatAvg = (allStatsArray, specificStat) => {
    console.log(specificStat)
    console.log(`allStatsArray.${specificStat}`)
    let statType = `allStatsArray.${specificStat}`
    const seasonStatArray = allStatsArray.map((value) => {
        value[specificStat]
    })

    console.log("seasonAssist by generic function", seasonStatArray)

}
// --------------------------------------



pokeballer.getPokemon = () => {
    $("#getPokemonButton").on("click", (event) => {
        event.preventDefault();
        console.log("best stat by id log from poke function", bestStatById)

        const categoryAndIDArray = [
            {
                category: "pts",
                id: 1
            },
            {
                category: "ast",
                id: 2
            },
            {
                category: "reb",
                id: 3
            },
            {
                category: "stl",
                id: 4
            },
            {
                category: "blk",
                id: 5
            },
            {
                category: "pf",
                id: 6
            },
            {
                category: "to",
                id: 7
            },
            {
                category: "fta",
                id: 8
            },
            {
                category: "normal",
                id: 9
            }
        ];
        console.log("category array", categoryAndIDArray);


        function whichCategory(idReference) {
            return idReference.id === bestStatById;
        }

        console.log("which category function", categoryAndIDArray.find(whichCategory));

        const pokemonStatCategory = (categoryAndIDArray.find(whichCategory)).category;
        console.log("pokemon stat category", pokemonStatCategory)

        const categoryAndTypeArray = [
            {
                category: "pts",
                type: "fire"
            },
            {
                category: "ast",
                type: "water"
            },
            {
                category: "reb",
                type: "dark"
            },
            {
                category: "stl",
                type: "psychic"
            },
            {
                category: "blk",
                type: "steel"
            },
            {
                category: "pf",
                type: "fighting"
            },
            {
                category: "to",
                type: "grass"
            },
            {
                category: "fta",
                type: "fairy"
            },
            {
                category: "normal",
                type: "normal"
            }
        ];

        console.log("category and type array", categoryAndTypeArray)

        function whichType(categoryReference) {
            console.log("whichType pokemon stat category", pokemonStatCategory)
            return categoryReference.category === pokemonStatCategory;
        }
        console.log("chosen category and type object", categoryAndTypeArray.find(whichType))

        let pokemonType = (categoryAndTypeArray.find(whichType).type)
        console.log("pokemon type", pokemonType)

        const allPokemonOfType = pokeballer.getPokeData(`type/${pokemonType}`)
        
        allPokemonOfType.then((pokemonTypeData) => {
            console.log("all pokemon of type", pokemonTypeData)
            console.log("all pokemon of type object", pokemonTypeData.pokemon)

            const allPokemonOfTypeArray = pokemonTypeData.pokemon
            const pokemonUrl = pokeballer.getPokemonUrl(allPokemonOfTypeArray);
            const specificPokemon = pokeballer.getPokeData(`${pokemonUrl}`)

            specificPokemon.then((specificPokemonData) => {
                console.log("specific pokemon object", specificPokemonData)

                const specificPokemonName = specificPokemonData.name

                const specificPokemonImageUrl = specificPokemonData.sprites.front_default

                if (specificPokemonImageUrl === null) {
                    alert(`Oh no, ${specificPokemonName} got away! Try catching another Pokemon`)
                } else {
                    $(".pokemonDiv").removeClass("hidden")
                    $(".pokemonDiv").append(`
                    <h3 class="capitalize">${specificPokemonName}</h3>
                    <img src="${specificPokemonImageUrl}" alt="${specificPokemonName}">
                    `)
                    
                }

                

            })
        })
    })
}

pokeballer.getPokemonUrl = (pokemonArray) => {
    const randomPokemonNumber = Math.floor(Math.random() * pokemonArray.length);
    console.log("randomPokemonNumber", randomPokemonNumber)

    const randomPokemonObject = pokemonArray[randomPokemonNumber].pokemon

    console.log("randomPokemonObject .name", randomPokemonObject.name)

    console.log("random pokemon object .url", randomPokemonObject.url)

    const randomPokemonUrl = randomPokemonObject.url

    const randomPokemonUrlArray = randomPokemonUrl.split("/v2/")
    console.log("randomPokemonUrlArray", randomPokemonUrlArray[1])

    const randomPokemonUrlSplit = randomPokemonUrlArray[1]

    return randomPokemonUrlSplit
}

pokeballer.getPlayerSearch = () => {
    $playerSearchForm.on("submit", (event) => {
        event.preventDefault();

        // $("#playerSearchForm")[0].reset();

        $("#playerSearchResults").removeClass("hidden")

        const $searchField = $("#playerSearchInput").val()
        console.log("player search", $searchField)

        const playerChoice = pokeballer.getBDIData(`players?search=${$searchField}`)
        playerChoice.then((playerData) => {
            console.log("player data", playerData)
            console.log("player data.data", playerData.data)


            const searchPlayerArray = playerData.data
            searchPlayerArray.forEach(element => {
                // is it working?
                console.log("searchPlayerArray", element.first_name, element.last_name, element.team.abbreviation)
                
                // populate drop down with search results
                $playerSearchSelect.append(`<option value="${element.id}">${element.first_name} ${element.last_name} (${element.team.abbreviation})</option>`)
            });

            pokeballer.getPlayerSelectValue();
            
        })
    })
}





// ------------------------------------
// API CALLS
pokeballer.getBDIData = (dataTypeBDI) => {
    const promiseBDI = $.ajax({
        url:`${pokeballer.baseUrlBDI}/${dataTypeBDI}`,
        method: "GET",
        dataType: "json",
        data: {
            per_page: "100",
        }
    });
    
    return promiseBDI;
}

pokeballer.getPokeData = (pokeDataType) => {
    const promisePoke = $.ajax({
        url:`${pokeballer.baseUrlPoke}/${pokeDataType}`,
        method: "GET",
        dataType: "json"
    });
    
    return promisePoke;
}



// ---------------------------------
// INIT
pokeballer.init = () => {
    console.log("hello")
    // test if api calls are working
    // pokeballer.getBDIData();
    // pokeballer.getPokeData();

    // pokeballer.getPlayerSelectValue();

    pokeballer.getPlayerSearch();

    pokeballer.getAllPlayerStats();

    pokeballer.getPokemon();

}

// -------------------------------
// DOCUMENT READY
$(function() {
    pokeballer.init();
})
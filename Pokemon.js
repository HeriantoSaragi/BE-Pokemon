const express = require('express')
const axios = require('axios').default;
const app = express()
const cors = require('cors')
const port = 3200

let pokemons = [];
let myPokemons = [];

function fetchPokemons() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=100`
    axios.get(url).then((response) => {
        pokemons = response.data.results.map((pokemon, index) => ({
            ...pokemon,
            id: index+1
        }));
    });
}

function isPrimeNumber(number) {
    if(number == 1) {
        return true;
    }

    let isPrime = true
    for (let i = 2; i < number; i++) {
        if (number % i == 0) {
            isPrime = false;
            break;
        }
    }
    return isPrime;
}

// get initial pokemons value from Poke-Api
fetchPokemons();

// setting cors configurattion
app.use(cors('*'));

app.get('/pokemons', (req, res) => {
    res.send(pokemons);
})

app.get('/pokemons/:pokemonId/catch', (req, res) => {
    const {pokemonId} = req.params;
    const selectedPokemon = pokemons.filter(pokemon => pokemon.id == pokemonId)[0];
    const isCatched = Math.round((Math.random() * 1).toFixed(2)) == 1 ? true : false;
    
    if(isCatched) {
        myPokemons.push({
            ...selectedPokemon,
            firstNumber: 0,
            secondNumber: 1,
            isRenamed: false,
            getNextFibonacciNumber: function() {
                const currentNumber = this.firstNumber;
                this.firstNumber = this.secondNumber;
                this.secondNumber = currentNumber + this.secondNumber;
                return currentNumber;
            }
        });
    }

    res.send({
        ...selectedPokemon,
        isCatched: isCatched
    });
})

app.get('/mypokemons', (req, res) => {
    res.send(myPokemons);
})

app.put('/mypokemons/:pokemonId', (req, res) => {
    const {pokemonId} = req.params;
    let selectedPokemon;
    myPokemons.forEach(pokemon => {
        if(pokemon.id == pokemonId) {
            selectedPokemon = pokemon
            pokemon.isRenamed = pokemon.isRenamed || true
        }
    });
    res.send({
        id: selectedPokemon.id,
        url: selectedPokemon.url,
        name: `${selectedPokemon.name}-${selectedPokemon.getNextFibonacciNumber()}`
    })
});

app.delete('/mypokemons/:pokemonId', (req, res) => {
    const {pokemonId} = req.params;
    const selectedPokemon = myPokemons.filter(pokemon => pokemon.id == pokemonId)[0];
    const isDeleted = isPrimeNumber(selectedPokemon.id);

    if(isDeleted) {
        myPokemons = myPokemons.filter(pokemon => pokemon.id != pokemonId);
    }

    res.send(
        {
            id: selectedPokemon.id,
            name: selectedPokemon.name,
            url: selectedPokemon.url,
            isDeleted: isDeleted
        }
    );
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
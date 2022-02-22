// Import des librairies
const csv = require('fast-csv');

const pokemons = [];
csv.parseFile('pokemon.csv', { headers: false }).on("data", row => {
  pokemons.push(row)
})

module.exports = {
  pokemons
}
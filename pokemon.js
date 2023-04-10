// Import des librairies
const csv = require('fast-csv');

const pokemons = [];
const generations = {
  'Kanto': '1',
  'Johto': '2',
  'Hoenn': '3',
  'Sinnoh': '4',
  'Unys': '5',
  'Kalos': '6',
  'Alola': '7',
  'Galar': '8',
  'Hisui': '8',
  'Paldea': '9'
}
csv.parseFile('pokemon.csv', { headers: false, delimiter: '|' }).on("data", row => {
  pokemons.push(row)
})

module.exports = {
  pokemons,
  generations
}

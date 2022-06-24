// Import des librairies
const { Client } = require('pg')

// Import des dépendances
const BotConfig = require('./bot_config.js')

const connectionString = BotConfig.connectionString

let clientDB;

if (process.env.DATABASE_URL.split('@')[1].split(':')[0] === 'localhost') {

  clientDB = new Client({
    connectionString
  })

} else {

  clientDB = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    }
  })

}

clientDB.connect()
clientDB.query('CREATE TABLE IF NOT EXISTS users (' +
    'id BIGINT NOT NULL PRIMARY KEY,' +
    'timestamp BIGINT,' +
    'xp BIGINT,' +
    'balance DECIMAL,' +
    'nb_caught BIGINT,' +
    'nb_shinies BIGINT,' +
    'nb_legendaries BIGINT,' +
    'nb_mythicals BIGINT,' +
    'nb_ultra_beasts BIGINT' +
  ');', (err, res) => {
  console.log(err, res)
})

// Adder générique
function addCol(id, col, type, gain) {
  return new Promise(function(resolve, reject) {
    let query = 'SELECT * FROM users WHERE id=' + id + ';'
    clientDB.query(query).then(res => {
      let val;
      if (type === 'int') {
        val = parseInt(res.rows[0][col])
      } else {
        val = parseFloat(res.rows[0][col])
      }
      val += gain
      resolve(setCol(id, col, val))
    }).catch(e => {
      console.error(e.stack)
      reject(-1)
    })
  })
}

// Getter générique
function getCol(id, col) {
  return new Promise(function(resolve, reject) {
    let query = 'SELECT * FROM users WHERE id=' + id + ';'
    clientDB.query(query).then(res => {
      resolve(res.rows[0][col])
    }).catch(e => {
      console.error(e.stack)
      reject(-1)
    })
  })
}

// Setter générique
function setCol(id, col, val) {
  return new Promise(function(resolve, reject) {
    let query = 'UPDATE users SET ' + col + '=' + val + ' WHERE id=' + id + ';'
    clientDB.query(query).then(res => {
      resolve(1)
    }).catch(e => {
      console.error(e.stack)
      reject(0)
    })
  })
}

module.exports = {
  clientDB,
  addCol,
  getCol,
  setCol
}
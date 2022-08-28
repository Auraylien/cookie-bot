function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function log(user, cmd) {
  const date = new Date()
  const txtDate =
    '[' +
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    '/' +
    ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +
    '/' +
    date.getFullYear() +
    ' - ' +
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
    ':' +
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    ':' +
    (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) +
    ']'
  
  console.debug(txtDate + ' ' + user.toString() + ' a utilisé la commande ' + cmd)
}

module.exports = {
  getRandomInt,
  log
}
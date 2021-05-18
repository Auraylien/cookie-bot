const Discord = require('discord.js');
const Axios = require('axios').default;
const client = new Discord.Client({presence: {activity: {name: 'préparer des cookies', type: 'PLAYING'}}});
const token = ''
const api_key_giphy = ''
const prefix = '?'

client.once('ready', () => {
   console.log('Le bot a été lancé.');
});

client.login(token);

// Commandes
client.on('message', message => {

  // Empêche le bot de réagir à ses propres messages
  if (!message.author.bot) {

    // Commande classique sans mention
    if (message.mentions.users.array().length === 0) {

      // Help
      if (message.content.toLowerCase().startsWith(prefix + 'help')) {
        message.channel.send(
          '```\n' +
          'Toutes les commandes commencent par "' + prefix + '"\n' +
          'help                       : affiche ce message\n' +
          'ping                       : répond "Pong"\n' +
          'cookie                     : recevoir un cookie\n' +
          'cookie <@qqn>              : offrir un cookie\n' +
          'cookie <@moi>              : s\'offrir un cookie\n' +
          'cookie <@qqn1> <@qqn2> ... : fête de cookies !!\n' +
          'lea                        : affiche le GIF de Lea\n' +
          'avatar                     : affiche ton avatar en grand\n' +
          'avatar <@qqn>              : affiche l\'avatar de qqn\n' +
          'sexe                       : commande spéciale pour AA\n' +
          'gif                        : envoie un gif aléatoire\n' +
          'gif <mot-clef>             : envoie un gif ayant comme tag mot-clef\n' +
          '\n' +
          'Le bot réagira également si l\'un des mots suivant est détecté :\n' +
          '- tabia' +
          '- mdr' +
          '- issou' +
          '- funny boy' +
          '```'
        )
      }

      // Ping
      if (message.content.toLowerCase().startsWith(prefix + 'ping')) {
        message.channel.send('Pong :+1:')
      }

      // Cookie
      if (message.content.toLowerCase().startsWith(prefix + 'cookie')) {
        message.channel.send("Voilà un cookie pour toi, " + message.author.toString() + " : :cookie:")
      }

      // Lea
      if (message.content.toLowerCase().startsWith(prefix + 'lea')) {
        message.channel.send('https://media.discordapp.net/attachments/801099428332699709/808096306744655872/Lea_et_son_placard.gif')
      }

      // Avatar
      if (message.content.toLowerCase().startsWith(prefix + 'avatar')) {
        message.channel.send(message.author.displayAvatarURL({'format': 'png', 'dynamic': true, 'size': 2048}));
      }

      // Sexe (spéciale pour AA)
      if (message.content.toLowerCase().startsWith(prefix + 'sexe')) {
        message.channel.send(':rolling_eyes:')
      }

      // Issou
      if (message.content.toLowerCase().startsWith(prefix + 'issou')) {
        message.channel.send('https://tenor.com/view/issou-drole-marrant-rire-rigoler-gif-6142116')
      }

	  // API GIPHY
	  if (message.content.toLowerCase().startsWith(prefix + 'gif')) {

      // Regarde si la commande possède un argument
      let count = message.content.toLowerCase().split(' ').length

      if (count >= 2) {

        let arg = message.content.toLowerCase().split(' ')[1]

        Axios.get('http://api.giphy.com/v1/gifs/random?tag=' + arg, {
          headers: { 'api_key': api_key_giphy }
        }).then((response) => {
          message.channel.send(response['data']['data']['url'])
        }, (response) => {
          console.log('Erreur')
        })

      } else {

        Axios.get('http://api.giphy.com/v1/gifs/random', {
          headers: { 'api_key': api_key_giphy }
        }).then((response) => {
          message.channel.send(response['data']['data']['url'])
        }, (response) => {
          console.log('Erreur').catch(err => console.logs(err))
        })

      }
    }

    // Commande avec mention(s)
    } else {

      // author : User
      let author = message.author

      // 1 seule mention
      if (message.mentions.users.array().length === 1) {

        // mention : User
        let mention = message.mentions.users.first()

        // L'utilisateur s'est taggé lui-même
        if (author === mention) {

          // Cookie
          if (message.content.toLowerCase().startsWith(prefix + 'cookie')) {
            message.channel.send(author.toString() + ' s\'offre un cookie ! :cookie:')
          }

          // Avatar
          if (message.content.toLowerCase().startsWith(prefix + 'avatar')) {
            message.channel.send(author.displayAvatarURL({'format': 'png', 'dynamic': true, 'size': 2048}));
          }

        } else {

          // Cookie
          if (message.content.toLowerCase().startsWith(prefix + 'cookie')) {
            message.channel.send(author.toString() + ' offre un cookie à ' + mention.toString() + ' ! :cookie:')
          }

          // Avatar
          if (message.content.toLowerCase().startsWith(prefix + 'avatar')) {
            message.channel.send(mention.displayAvatarURL({'format': 'png', 'dynamic': true, 'size': 2048}));
          }

        }

      // 2 ou plus
      } else {

        // Cookie
        if (message.content.toLowerCase().startsWith(prefix + 'cookie')) {
          message.channel.send('Cookie pour tout le monde !!! :cookie::cookie::cookie:')
        }
      }
    }
  }
})

// Mot dans les messages
client.on("message", message => {

  // Empêche le bot de réagir à ses propres messages
  if (!message.author.bot) {

    // Tabia
    if (message.content.toLowerCase().includes("tabia")) {
      message.channel.send("Maaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah... *clac de souris*")
      message.react(message.guild.emojis.cache.get('832303476746616873')).then(console.log).catch(console.error)
    }

    // Funny boy
    if (message.content.toLowerCase().includes("funny boy")) {
      message.react('🤪').then(console.log).catch(console.error);
    }

    // Mdr
    if (message.content.toLowerCase().includes("mdr")) {
      message.react('😂').then(console.log).catch(console.error);
    }

    // Issou
    if (message.content.toLowerCase().includes("issou")) {
      message.react(message.guild.emojis.cache.get('832303469314048000')).then(console.log).catch(console.error);
    }

  }
})

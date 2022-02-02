const Discord = require('discord.js');
const Axios = require('axios').default;
const csv = require('fast-csv');
const fs = require('fs');
const client = new Discord.Client({presence: {activity: {name: 'préparer des cookies', type: 'PLAYING'}}, intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]});
const token = ''
const api_key_giphy = ''
const prefix = '?'
const nombrePokemons = 898

// Params API YouTube
const api_youtube = ''
const dekuNoSekaiID = ''
const maxResultYtb = 50 // 0-50

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

client.once('ready', () => {
   console.log('Le bot a été lancé.');
});

client.login(token);

const pokemons = [];

csv.parseFile('pokemon.csv', { headers: false })
  .on("data", row => {
    pokemons.push(row)
  })

// Commandes
client.on('message', message => {

  // Empêche le bot de réagir à ses propres messages
  if (!message.author.bot) {

    // Commande classique sans mention
    if (message.mentions.users.size === 0) {

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
          'dlb                        : affiche le GIF de DLB\n' +
          'avatar                     : affiche ton avatar en grand\n' +
          'avatar <@qqn>              : affiche l\'avatar de qqn\n' +
          'sexe                       : commande spéciale pour AA\n' +
          'gif                        : envoie un gif aléatoire\n' +
          'gif <mot-clef>             : envoie un gif ayant comme tag mot-clef\n' +
          'random <a,b,...,N>         : fait un choix au hasard entre a, b, ... et N\n' +
          'ytb                        : envoie une vidéo au hasard de ma chaîne Youtube\n' +
          'ytb <mot-clef>             : envoie une vidéo de ma chaîne en rapport avec le mot-clef\n' +
          'pokemon                    : invoque un Pokémon au hasard parmis les 898 Pokémons (1G-8G). 1 chance sur 20 qu\'il soit chromatique\n' +
          '\n' +
          'Le bot réagira également si l\'un des mots suivant est détecté :\n' +
          '- tabia\n' +
          '- issou\n' +
          '- funny boy\n' +
          '- funny girl' +
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

      // DLB
      if (message.content.toLowerCase().startsWith(prefix + 'dlb')) {
        message.channel.send('https://media.discordapp.net/attachments/632239527745945606/930919265043886180/vous_ne_me_meritez_pas.gif')
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

      // Pokémon
      if (message.content.toLowerCase().startsWith(prefix + 'pokemon')) {
        let idPoke = getRandomInt(nombrePokemons) + 1;
        let fabuleux = pokemons[idPoke][17];
        let legendaire = pokemons[idPoke][18];
        let ultraChimere = pokemons[idPoke][19];
        let numShiny = getRandomInt(20) + 1;
        let texte;
        let img;

        if (fabuleux == 1) {
          if (numShiny != 20) {
            texte = message.member.displayName + ' a invoqué un fabuleux **' + pokemons[idPoke][14] + '** !';
          } else {
            texte = ':sparkles: ' + message.member.displayName + ' a invoqué un fabuleux **' + pokemons[idPoke][14] + ' chromatique** ! :sparkles:';
          }
        } else if (legendaire == 1) {
          if (numShiny != 20) {
            texte = message.member.displayName +  ' a invoqué un légendaire **' + pokemons[idPoke][14] + '** !';
          } else {
            texte = ':sparkles: ' + message.member.displayName + ' a invoqué un légendaire **' + pokemons[idPoke][14] + ' chromatique** ! :sparkles:';
          }
        } else if (ultraChimere == 1) {
          if (numShiny != 20) {
            texte = message.member.displayName + ' a invoqué une ultra-chimère **' + pokemons[idPoke][14] + '** !';
          } else {
            texte = ':sparkles: ' + message.member.displayName + ' a invoqué une ultra-chimère **' + pokemons[idPoke][14] + ' chromatique** ! :sparkles:';
          }
        } else {
          if (numShiny != 20) {
            texte = message.member.displayName + ' a invoqué un **' + pokemons[idPoke][14] + '** !';
          } else {
            texte = ':sparkles: ' + message.member.displayName + ' a invoqué un **' + pokemons[idPoke][14] + ' chromatique** ! :sparkles:';
          }
        }

        if (numShiny != 20) {
          message.channel.send({
            content: texte,
            files: [{
              attachment: 'img_poke/normal/' + parseInt(idPoke) + '.png',
              name: pokemons[idPoke][14] + '.png',
              description: 'Image du Pokémon ' + pokemons[idPoke][14]
            }]
          })
        } else {
          message.channel.send({
            content: texte,
            files: [{
              attachment: 'img_poke/shiny/' + parseInt(idPoke) + '.png',
              name: pokemons[idPoke][14] + '.png',
              description: 'Image du Pokémon ' + pokemons[idPoke][14] + ' chromatique'
            }]
          })
        }
      }

      // Random
      if (message.content.toLowerCase().startsWith(prefix + 'random')) {
        let choix = message.content.substring(8).split(',')
        

        if (choix.length == 1 && choix[0] == '') {
          message.channel.send(":information_source: Utilisation: ?random choix1,choix2,...,choixN")
        } else if (choix.length == 1) {
          message.channel.send(":white_check_mark: Je choisis : " + choix[0] + " (petit rigolo ...)")
        } else {
          let idChoix = getRandomInt(choix.length);
          message.channel.send(":white_check_mark: Je choisis : " + choix[idChoix])
        }
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

      // API YouTube
      if (message.content.toLowerCase().startsWith(prefix + 'ytb')) {

        // Regarde si la commande possède un argument
        let count = message.content.toLowerCase().split(' ').length

        if (count >= 2) {

          let keyword = message.content.toLowerCase().split(' ')[1]

          Axios.get('https://www.googleapis.com/youtube/v3/search?key=' + api_youtube + '&channelId=' + dekuNoSekaiID + '&maxResults=' + maxResultYtb + '&q=' + keyword)
            .then((response) => {
              let idVideo = getRandomInt(response['data']['items'].length) + 1;
              if (response['data']['items'].length != 0) {
                message.channel.send('https://www.youtube.com/watch?v=' + response['data']['items'][idVideo]['id']['videoId'])
              } else {
                message.channel.send('Je n\'ai rien trouvé... :frowning:\nEssaie sans accent !!')
              }
            }, (response) => {
              console.log('Erreur')
            }
          )

        } else {

          Axios.get('https://www.googleapis.com/youtube/v3/search?key=' + api_youtube + '&channelId=' + dekuNoSekaiID + '&maxResults=' + maxResultYtb)
            .then((response) => {
              let idVideo = getRandomInt(response['data']['items'].length) + 1;
              if (response['data']['items'].length != 0) {
                message.channel.send('https://www.youtube.com/watch?v=' + response['data']['items'][idVideo]['id']['videoId'])
              } else {
                message.channel.send('Je n\'ai rien trouvé... :frowning:\nEssaie sans accent !!')
              }
            }, (response) => {
              console.log('Erreur')
            }
          )

        }

      }

    // Commande avec mention(s)
    } else {

      // author : User
      let author = message.author

      // 1 seule mention
      if (message.mentions.users.size === 1) {

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
    }

    // Funny boy
    if (message.content.toLowerCase().includes("funny boy")) {
      message.react('🤪').then(console.log).catch(console.error);
    }

    // Funny girl
    if (message.content.toLowerCase().includes("funny girl")) {
      message.react('🤪').then(console.log).catch(console.error);
    }

    // Mdr
    // if (message.content.toLowerCase().includes("mdr")) {
    //   message.react('😂').then(console.log).catch(console.error);
    // }

    // Issou
    if (message.content.toLowerCase().includes("issou")) {
      message.react(message.guild.emojis.cache.get('832303469314048000')).then(console.log).catch(console.error);
    }

  }
})

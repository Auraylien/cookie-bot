// Import des librairies
const { Routes }                                           = require('discord-api-types/v9')
const { Client, MessageEmbed, Intents, MessageAttachment } = require('discord.js')
const { SlashCommandBuilder }                              = require('@discordjs/builders')
const { REST }                                             = require("@discordjs/rest")
const Axios                                                = require('axios')

// Import des dépendances
const Functions = require('./functions.js')
const BotConfig = require('./bot_config.js')
const Pokemon   = require('./pokemon.js')
const Database  = require('./database.js')

// Création de l'instance du bot
const discordClient = new Client({
  presence: {
    activities: [
      {name: 'préparer des cookies', type: 'PLAYING'}
    ]
  },
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

discordClient.on('ready', () => {
   console.log('Le bot a été lancé.')
})
discordClient.login(BotConfig.discordToken)

///////////////////////////
///// COMMANDES SLASH /////
///////////////////////////
const cmdPing = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Réponds avec un "Pong"')

const cmdHelp = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche l\'aide complète')

const cmdCookie = new SlashCommandBuilder()
    .setName('cookie')
    .setDescription('Offrir un cookie à quelqu\'un')
    .addUserOption(option =>
      option.setName('utilisateur').setDescription('L\'utilisateur à qui offrir un cookie').setRequired(true))

const cmdLea = new SlashCommandBuilder()
    .setName('lea')
    .setDescription('Envoie le GIF "Lea et son placard"')

const cmdDlb = new SlashCommandBuilder()
    .setName('dlb')
    .setDescription('Envoie le GIF "Vous ne me méritez pas" de DLB')

const cmdAvatar = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Affiche l\'avatar de quelqu\'un en grand')
    .addUserOption(option =>
      option.setName('utilisateur').setDescription('L\'utilisateur cible pour afficher l\'avatar').setRequired(false))

// const cmdBanner = new SlashCommandBuilder()
//     .setName('banner')
//     .setDescription('Affiche la bannière du profil de quelqu\'un (disponible avec Discord Nitro)')
//     .addUserOption(option =>
//       option.setName('utilisateur').setDescription('L\'utilisateur cible pour afficher la bannière').setRequired(false))

const cmdIssou = new SlashCommandBuilder()
    .setName('issou')
    .setDescription('Envoie le GIF de Risitas')

const cmdRandom = new SlashCommandBuilder()
    .setName('random')
    .setDescription('Renvoie une des options en entrée choisie au hasard')
    .addStringOption(option =>
      option.setName('option1').setDescription('L\'option 1').setRequired(true))
    .addStringOption(option =>
      option.setName('option2').setDescription('L\'option 2').setRequired(true))
    .addStringOption(option =>
      option.setName('option3').setDescription('L\'option 3').setRequired(false))
    .addStringOption(option =>
      option.setName('option4').setDescription('L\'option 4').setRequired(false))
    .addStringOption(option =>
      option.setName('option5').setDescription('L\'option 5').setRequired(false))
    .addStringOption(option =>
      option.setName('option6').setDescription('L\'option 6').setRequired(false))
    .addStringOption(option =>
      option.setName('option7').setDescription('L\'option 7').setRequired(false))
    .addStringOption(option =>
      option.setName('option8').setDescription('L\'option 8').setRequired(false))
    .addStringOption(option =>
      option.setName('option9').setDescription('L\'option 9').setRequired(false))
    .addStringOption(option =>
      option.setName('option10').setDescription('L\'option 10').setRequired(false))

const cmdGiphy = new SlashCommandBuilder()
    .setName('gif')
    .setDescription('Envoie un GIF aléatoire ou ayant "tag" comme tag si précisé')
    .addStringOption(option =>
      option.setName('tag').setDescription('Le tag que le GIF doit posséder').setRequired(false))

const cmdYtb = new SlashCommandBuilder()
    .setName('youtube')
    .setDescription('Envoie une vidéo au hasard de ma chaîne YouTube')
    .addStringOption(option =>
      option.setName('mot-clef').setDescription('Un mot-clef contenu dans le titre de la vidéo'))

const cmdPokemon = new SlashCommandBuilder()
    .setName('pokemon')
    .setDescription('Invoque des Pokémon et accumule des Poképièces et de l\'XP !')
    .addSubcommand(subcommand =>
      subcommand
        .setName('register')
        .setDescription('Permet de t\'enregistrer dans la base de données afin de pouvoir jouer'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('xp')
        .setDescription('Permet de consulter ton XP'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('bal')
        .setDescription('Permet de consulter ton argent (Poképièces)'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('stats')
        .setDescription('Permet de consulter tes statistiques d\'invocations'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('invocation')
        .setDescription('Invoque un Pokémon aléatoire. 1 chance sur 20 qu\'il soit chromatique !'))

const slashCommands = [
  cmdPing.toJSON(),
  cmdHelp.toJSON(),
  cmdCookie.toJSON(),
  cmdLea.toJSON(),
  cmdDlb.toJSON(),
  cmdAvatar.toJSON(),
  // cmdBanner.toJSON(),
  cmdIssou.toJSON(),
  cmdRandom.toJSON(),
  cmdGiphy.toJSON(),
  cmdYtb.toJSON(),
  cmdPokemon.toJSON()
]

//////////////////////////////
///// INITIALISATION BOT /////
//////////////////////////////
const rest = new REST({ version: '9' }).setToken(BotConfig.discordToken);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(
        Routes.applicationCommands(BotConfig.discordClientID),
        { body: slashCommands },
    );

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
})()

////////////////////////////////////
///// CODE DES COMMANDES SLASH /////
////////////////////////////////////
discordClient.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return

  // /ping
  if (interaction.commandName === 'ping') {
    Functions.log(interaction.member.displayName, 'ping')
    await interaction.reply('Pong :+1:')
  }

  // /help
  if (interaction.commandName === 'help') {
    Functions.log(interaction.member.displayName, 'help')
    await interaction.reply(
      '```\n' +
      'Toutes les fonctionnalités s\'utilisent avec la commande slash (/) :\n' +
      'help                       : affiche ce message\n' +
      'ping                       : répond "Pong"\n' +
      'cookie <utilisateur>       : offrir un cookie\n' +
      'lea                        : affiche le GIF de Lea\n' +
      'dlb                        : affiche le GIF de DLB\n' +
      'avatar                     : affiche ton avatar en grand\n' +
      'avatar <utilisateur>       : affiche l\'avatar de quelqu\'un\n' +
      'gif                        : envoie un GIF aléatoire\n' +
      'gif <mot-clef>             : envoie un GIF ayant comme tag mot-clef\n' +
      'random <1> <2> ... <10>    : fait un choix au hasard entre <1>, <2>, ... et <10>\n' +
      'ytb                        : envoie une vidéo au hasard de ma chaîne Youtube\n' +
      'ytb <mot-clef>             : envoie une vidéo de ma chaîne en rapport avec le mot-clef\n' +
      'pokemon                    : mini-jeu d\'invocation de Pokémon !\n' +
      '|-- register                 > enregistrement pour utiliser les fonctions liées aux Pokémon\n' +
      '|-- stats                    > affiche tes statistiques sur tes invocations de Pokémon\n' +
      '|-- xp                       > affiche ton XP accumulée avec les invocations de Pokémon\n' +
      '|-- bal                      > affiche tes Poképièces accumulées avec les invocations de Pokémon\n' +
      '|-- invocation               > invoque un Pokémon au hasard parmi les 905 Pokémon (1G-8G)\n' +
      '\n' +
      'Ce bot a été créé avec amour par Auraylien. <3\n' +
      'https://github.com/Auraylien/cookie-bot-public\n' +
      '```'
    )
  }

  // /cookie <utilisateur>
  if (interaction.commandName === 'cookie') {

    Functions.log(interaction.member.displayName, 'cookie')

    if (interaction.options.getUser('utilisateur')) {
      const user = interaction.options.getUser('utilisateur')

      if (interaction.user === user) {
        await interaction.reply(user.toString() + " s'offre un cookie ! :cookie:")
      } else {
        await interaction.reply("Voilà un cookie pour toi, " + user.toString() + " : :cookie:")
      }
    }

  }

  // /lea
  if (interaction.commandName === 'lea') {
    Functions.log(interaction.member.displayName, 'lea')
    await interaction.reply('https://media.discordapp.net/attachments/801099428332699709/808096306744655872/Lea_et_son_placard.gif')
  }

  // /dlb
  if (interaction.commandName === 'dlb') {
    Functions.log(interaction.member.displayName, 'dlb')
    await interaction.reply('https://media.discordapp.net/attachments/632239527745945606/930919265043886180/vous_ne_me_meritez_pas.gif')
  }

  // /avatar <?utilisateur>
  if (interaction.commandName === 'avatar') {
    Functions.log(interaction.member.displayName, 'avatar')
    const user = interaction.options.getUser('utilisateur')

    if (user === null) {
      await interaction.reply(interaction.user.avatarURL({'format': 'png', 'dynamic': true, 'size': 2048}))
    } else {
      await interaction.reply(user.avatarURL({'format': 'png', 'dynamic': true, 'size': 2048}))
    }
  }

  // /banner <?utilisateur> -- Désactivé le temps de trouver comment faire
  // if (interaction.commandName === 'banner') {
  //   Functions.log(interaction.member.displayName, 'banner')
  //   const user = interaction.options.getUser('utilisateur')
  //   let banner

  //   if (user === null) {
  //     interaction.user.fetch()
  //     banner = interaction.user.bannerURL({'format': 'png', 'dynamic': true, 'size': 2048})
  //   } else {
  //     user.fetch()
  //     banner = user.bannerURL({'format': 'png', 'dynamic': true, 'size': 2048})
  //   }

  //   if (banner === null) {
  //     await interaction.reply('Cet utilisateur ne possède aucune bannière de profil.')
  //   } else {
  //     await interaction.reply(banner)
  //   }
  // }

  // /issou
  if (interaction.commandName === 'issou') {
    Functions.log(interaction.member.displayName, 'issou')
    await interaction.reply('https://tenor.com/view/issou-drole-marrant-rire-rigoler-gif-6142116')
  }

  // /random <option1> <option2> <?option3> ... <?option10>
  if (interaction.commandName === 'random') {
    Functions.log(interaction.member.displayName, 'random')
    const options = []
    let i = 1
    for (i; i < 11; i++) {
      if (interaction.options.getString('option' + i) !== null) {
        options.push(interaction.options.getString('option' + i))
      }
    }

    if (options.length === 2 && options[0] === options[1]) {
      await interaction.reply('Je choisis : ' + options[0] + ' (petit rigolo ...)')
    } else {
      await interaction.reply('Je choisis : ' + options[Functions.getRandomInt(options.length)])
    }
  }

  // /gif <?tag>
  if (interaction.commandName === 'gif') {
    Functions.log(interaction.member.displayName, 'gif')
    const tag = interaction.options.getString('tag')
    let url

    if (tag !== null) {
      url = 'http://api.giphy.com/v1/gifs/random?tag=' + tag
    } else {
      url = 'http://api.giphy.com/v1/gifs/random'
    }

    Axios.get(url, {
      headers: { 'api_key': BotConfig.giphyToken }
    }).then((response) => {
      interaction.reply(response['data']['data']['url'])
    }).catch((response) => {
      console.error('Erreur : ' + response)
      interaction.reply('Erreur : impossible de rechercher un GIF, ou aucun GIF trouvé.')
    })

  }

  // /ytb <?mot-clef>
  if (interaction.commandName === 'youtube') {
    Functions.log(interaction.member.displayName, 'youtube')
    const motClef = interaction.options.getString('mot-clef')
    let url

    if (motClef !== null) {
      url = 'https://www.googleapis.com/youtube/v3/search?key=' + BotConfig.youtubeToken + '&channelId=' + BotConfig.youtubeChanelId + '&maxResults=' + BotConfig.maxResultYtb + '&q=' + motClef
    } else {
      url = 'https://www.googleapis.com/youtube/v3/search?key=' + BotConfig.youtubeToken + '&channelId=' + BotConfig.youtubeChanelId + '&maxResults=' + BotConfig.maxResultYtb
    }

    Axios.get(url)
      .then((response) => {
        if (response['data']['items'].length != 0) {
          let idVideo = Functions.getRandomInt(response['data']['items'].length) + 1
          interaction.reply('https://www.youtube.com/watch?v=' + response['data']['items'][idVideo]['id']['videoId'])
        } else {
          interaction.reply('Je n\'ai rien trouvé... :frowning:\nSi tu es en train de faire une recherche avec un mot clé, essaie sans les accents !!')
        }
      }).catch((response) => {
          console.error('Erreur : ' + response)
          interaction.reply('Erreur : impossible de rechercher une vidéo.')
        }
      )

  }

  // /pokemon
  if (interaction.commandName === 'pokemon') {

    // /pokemon register
    if (interaction.options.getSubcommand() === 'register') {
      Functions.log(interaction.member.displayName, 'pokemon register')
      let text = 'INSERT INTO users(id, timestamp, xp, balance, nb_caught, nb_shinies, nb_legendaries, nb_mythicals, nb_ultra_beasts) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *'
      let values = [interaction.user.id, null, 0, 0, 0, 0, 0, 0, 0]

      Database.clientDB.query(text, values).then(res => {
        interaction.reply('Enregistrement effectué avec succès ! Tu peux désormais utiliser les fonctionnalités liées aux Pokémons !')
      }).catch(e => {
        console.error('Erreur : ' + e)
        interaction.reply('Problème durant ton enregistrement : tu es déjà enregistré !')
      })
    }

    // /pokemon xp
    if (interaction.options.getSubcommand() === 'xp') {
      Functions.log(interaction.member.displayName, 'pokemon xp')
      Database.getCol(interaction.user.id, 'xp').then(xp => {
        interaction.reply("Tu as actuellement " + xp + " XP.")
      }).catch(e => {
        console.error(e)
        interaction.reply('Une erreur est survenue dans la lecture de ton XP : as-tu effectué ton enregistrement avec `/pokemon register` ?')
      })
    }

    // /pokemon bal
    if (interaction.options.getSubcommand() === 'bal') {
      Functions.log(interaction.member.displayName, 'pokemon bal')
      Database.getCol(interaction.user.id, 'balance').then(bal => {
        interaction.reply("Tu as actuellement " + bal + " poképièces.")
      }).catch(e => {
        console.error(e)
        interaction.reply('Une erreur est survenue dans la lecture de ton argent : as-tu effectué ton enregistrement avec `/pokemon register` ?')
      })
    }

    // /pokemon stats
    if (interaction.options.getSubcommand() === 'stats') {
      Functions.log(interaction.member.displayName, 'pokemon stats')
      let normal = "0"
      let shiny = "0"
      let legendary = "0"
      let mythical = "0"
      let ultraBeast = "0"

      Database.getCol(interaction.user.id, 'nb_caught').then(val => {
        normal = val

        Database.getCol(interaction.user.id, 'nb_shinies').then(val => {
          shiny = val

          Database.getCol(interaction.user.id, 'nb_legendaries').then(val => {
            legendary = val

            Database.getCol(interaction.user.id, 'nb_mythicals').then(val => {
              mythical = val

              Database.getCol(interaction.user.id, 'nb_ultra_beasts').then(val => {
                ultraBeast = val

                statsEmbed = new MessageEmbed().setColor("#FFFF00")
                                    .setTitle("Statistiques de " + interaction.member.displayName)
                                    .setDescription("Nombre de Pokémons attrapés")
                                    .setThumbnail(interaction.user.displayAvatarURL({'format': 'png', 'dynamic': true, 'size': 2048}))
                                    .addFields(
                                      { name: 'Normaux', value: normal, inline: true },
                                      { name: 'Légendaires', value: legendary, inline: true },
                                      { name: 'Fabuleux', value: mythical, inline: true },
                                      { name: 'Ultra-chimères', value: ultraBeast, inline: true },
                                      { name: 'Shinies', value: shiny, inline: true },
                                      { name: '\u200b', value: '\u200b', inline: true }
                                    )
                interaction.reply({ embeds: [statsEmbed]})
              })
            })
          })
        })
      }).catch(e => {
        console.error(e)
        interaction.reply('Une erreur est survenue dans la lecture de tes stats : as-tu effectué ton enregistrement avec `/pokemon register` ?')
      })
    }

    // /pokemon invocation
    if (interaction.options.getSubcommand() === 'invocation') {
      Functions.log(interaction.member.displayName, 'pokemon invocation')
      let idPoke = Functions.getRandomInt(BotConfig.nombrePokemons) + 1
      let diffSexe = Pokemon.pokemons[idPoke][5]
      let fabuleux = Pokemon.pokemons[idPoke][6]
      let legendaire = Pokemon.pokemons[idPoke][7]
      let ultraChimere = Pokemon.pokemons[idPoke][8]
      let evolveTo = Pokemon.pokemons[idPoke][9]
      let evolveFrom = Pokemon.pokemons[idPoke][10]
      let numShiny = Functions.getRandomInt(20) + 1
      let numSexe  = Functions.getRandomInt(2) + 1
      let texte
      let now = parseInt(+Date.now()/1000)
      Database.getCol(interaction.user.id, 'timestamp').then((time) => {

        if (time === "" || now >= time) {

          let xp = 0
          let bal = 0

          // Le Pokémon est fabuleux
          if (fabuleux == 1) {

            // Gestion des récompenses
            xp = 500
            bal = 1500

            // On incrémente le compteur de fabuleux attrapés
            Database.addCol(interaction.user.id, 'nb_mythicals', 'int', 1)

            // Si Pokémon chromatique, on incrémente le compteur des chromatiques et on
            // octroie un bonus de 500 à l'XP et aux Poképièces
            if (numShiny != 20) {
              texte = interaction.member.displayName + ' a invoqué un fabuleux **' + Pokemon.pokemons[idPoke][2] + '** !'
              Database.addCol(interaction.user.id, 'xp', 'int', xp)
              Database.addCol(interaction.user.id, 'balance', 'float', bal)
            } else {
              texte = ':sparkles: ' + interaction.member.displayName + ' a invoqué un fabuleux **' + Pokemon.pokemons[idPoke][2] + ' chromatique** ! :sparkles:'
              Database.addCol(interaction.user.id, 'nb_shinies', 'int', 1)
              Database.addCol(interaction.user.id, 'xp', 'int', xp + 500)
              Database.addCol(interaction.user.id, 'balance', 'float', bal + 500)
              xp += 500
              bal += 500
            }

          // Le Pokémon est légendaire
          } else if (legendaire == 1) {

            // Gestion des récompenses
            xp = 350
            bal = 1000

            // On incrémente le compteur de légendaires attrapés
            Database.addCol(interaction.user.id, 'nb_legendaries', 'int', 1)

              // Si Pokémon chromatique, on incrémente le compteur des chromatiques et on
              // octroie un bonus de 200 à l'XP et aux Poképièces
              if (numShiny != 20) {
                texte = interaction.member.displayName +  ' a invoqué un légendaire **' + Pokemon.pokemons[idPoke][2] + '** !'
                Database.addCol(interaction.user.id, 'xp', 'int', xp)
                Database.addCol(interaction.user.id, 'balance', 'float', bal)
              } else {
                texte = ':sparkles: ' + interaction.member.displayName + ' a invoqué un légendaire **' + Pokemon.pokemons[idPoke][2] + ' chromatique** ! :sparkles:'
                Database.addCol(interaction.user.id, 'nb_shinies', 'int', 1)
                Database.addCol(interaction.user.id, 'xp', 'int', xp + 200)
                Database.addCol(interaction.user.id, 'balance', 'float', bal + 200)
                xp += 200
                bal += 200
              }

          // Le Pokémon est une ultra-chimère
          } else if (ultraChimere == 1) {

            // Gestion des récompenses
            xp = 200
            bal = 750

            // On incrémente le compteur d'ultra-chimères attrapées
            Database.addCol(interaction.user.id, 'nb_ultra_beasts', 'int', 1)

            // Si Pokémon chromatique, on incrémente le compteur des chromatiques et on
            // octroie un bonus de 100 à l'XP et aux Poképièces
            if (numShiny != 20) {
              texte = interaction.member.displayName + ' a invoqué une ultra-chimère **' + Pokemon.pokemons[idPoke][2] + '** !'
              Database.addCol(interaction.user.id, 'xp', 'int', xp)
              Database.addCol(interaction.user.id, 'balance', 'float', bal)
            } else {
              texte = ':sparkles: ' + interaction.member.displayName + ' a invoqué une ultra-chimère **' + Pokemon.pokemons[idPoke][2] + ' chromatique** ! :sparkles:'
              Database.addCol(interaction.user.id, 'nb_shinies', 'int', 1)
              Database.addCol(interaction.user.id, 'xp', 'int', xp + 100)
              Database.addCol(interaction.user.id, 'balance', 'float', bal + 100)
              xp += 100
              bal += 100
            }

          // Le Pokémon est normal
          } else {

            // Pokémon sans évolution
            if (evolveTo === "" && evolveFrom === "") {

              xp = 10 + Functions.getRandomInt(30) + 1  // + [10-40] XP
              bal = 10 + Functions.getRandomInt(30) + 1 // + [10-40] poképièces

            // Pokémon évolution finale
            } else if (evolveTo === "" && evolveFrom !== "") {

              xp = 75 + Functions.getRandomInt(25) + 1  // + [75-100] XP
              bal = 75 + Functions.getRandomInt(25) + 1 // + [75-100] poképièces

            // Pokémon évolution intermédiaire
            } else if (evolveTo !== "" && evolveFrom !== "") {

              xp = 30 + Functions.getRandomInt(20) + 1  // + [30-50] XP
              bal = 30 + Functions.getRandomInt(20) + 1 // + [30-50] poképièces

            // Pokémon évolution de base
            } else if (evolveTo !== "" && evolveFrom === "") {

              xp = 5 + Functions.getRandomInt(20) + 1  // + [5-25] XP
              bal = 5 + Functions.getRandomInt(20) + 1 // + [5-25] poképièces

            // En cas d'erreur avec les if, on met 0 par défaut
            } else {

              xp = 0
              bal = 0

            }

            // On incrémente le compteur de Pokémon attrapés
            Database.addCol(interaction.user.id, 'nb_caught', 'int', 1)

            // Si Pokémon chromatique, on incrémente le compteur des chromatiques et on
            // octroie un bonus de 100 à l'XP et aux Poképièces
            if (numShiny !== 20) {
              texte = interaction.member.displayName + ' a invoqué un **' + Pokemon.pokemons[idPoke][2] + '** !'
              Database.addCol(interaction.user.id, 'xp', 'int', xp)
              Database.addCol(interaction.user.id, 'balance', 'float', bal)
            } else {
              texte = ':sparkles: ' + interaction.member.displayName + ' a invoqué un **' + Pokemon.pokemons[idPoke][2] + ' chromatique** ! :sparkles:'
              Database.addCol(interaction.user.id, 'nb_shinies', 'int', 1)
              Database.addCol(interaction.user.id, 'xp', 'int', xp + 100)
              Database.addCol(interaction.user.id, 'balance', 'float', bal + 100)
              xp += 100
              bal += 100
            }

          }

          // On met à jour le timestamp
          let timestamp = parseInt(now) + 300
          Database.setCol(interaction.user.id, 'timestamp', timestamp)

          // Création des messages de l'embed
          let textXp = "+" + xp + " XP"
          let textBal = "+" + bal + " Poképièces"

          // Création de la photo de l'embed
          let photo
          if (numShiny !== 20) {

            // Si le Pokémon possède une différence en fonction du sexe, on adapte l'image
            if (diffSexe === "1") {

              if (numSexe === 1) {

                // Mâle
                photo = new MessageAttachment('./img_poke/normal/' + idPoke + '_m.png', idPoke + '.png')

              } else {

                // Femelle
                photo = new MessageAttachment('./img_poke/normal/' + idPoke + '_f.png', idPoke + '.png')

              }

            } else {

              // Aucune différence de sexe
              photo = new MessageAttachment('./img_poke/normal/' + idPoke + '.png', idPoke + '.png')

            }

          } else {

            // Si le Pokémon possède une différence en fonction du sexe, on adapte l'image
            if (diffSexe === "1") {

              if (numSexe === 1) {

                // Mâle
                photo = new MessageAttachment('./img_poke/shiny/' + idPoke + '_m.png', idPoke + '.png')

              } else {

                // Femelle
                photo = new MessageAttachment('./img_poke/shiny/' + idPoke + '_f.png', idPoke + '.png')

              }

            } else {

              // Aucune différence de sexe
              photo = new MessageAttachment('./img_poke/shiny/' + idPoke + '.png', idPoke + '.png')

            }

          }

          // Création de l'embed
          let result = new MessageEmbed()
            .setTitle("Invocation !")
            .setDescription(texte)
            .addFields(
              { name: 'Gain d\'XP', value: textXp, inline: true },
              { name: '\u200b', value: '\u200b', inline: true },
              { name: 'Gain de Poképièces', value: textBal, inline: true }
            )
            .setImage('attachment://' + idPoke + '.png')
          interaction.reply({ embeds: [result], files: [photo] })

        } else {

          const timeLeft = time - now
          const minutesLeft = Math.trunc(timeLeft / 60)
          const secondsLeft = timeLeft - (minutesLeft * 60)

          if (minutesLeft === 0) {
            interaction.reply('Seconde, papillon ! Tu dois encore attendre ' + secondsLeft + 's avant de réinvoquer un Pokémon. Patiente jusque <t:' + time + ':T> !')
          } else {
            interaction.reply('Minute, papillon ! Tu dois encore attendre ' + minutesLeft + 'm' + secondsLeft + 's avant de réinvoquer un Pokémon. Patiente jusque <t:' + time + ':T> !')
          }

        }

      }).catch(e => {
        console.error(e)
        interaction.reply('Une erreur est survenue durant l\'invocation : as-tu effectué ton enregistrement avec `/pokemon register` ?')
      })
    }

  }

});

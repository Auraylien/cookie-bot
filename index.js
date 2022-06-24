// Import des librairies
const { Client, MessageEmbed, Intents, MessageAttachment} = require('discord.js')
const Axios                             = require('axios')

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

discordClient.once('ready', () => {
   console.log('Le bot a été lancé.');
});
discordClient.login(BotConfig.discordToken);

// Commandes
discordClient.on('message', message => {

  // Empêche le bot de réagir à ses propres messages
  if (!message.author.bot) {

    // Commande classique sans mention
    if (message.mentions.users.size === 0) {

      // ?regist : inscription d'un joueur dans la database
      if (message.content.toLocaleLowerCase().startsWith(BotConfig.prefix + 'register')) {

        let text = 'INSERT INTO users(id, timestamp, xp, balance, nb_caught, nb_shinies, nb_legendaries, nb_mythicals, nb_ultra_beasts) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
        let values = [message.author.id, null, 0, 0, 0, 0, 0, 0, 0];
        
        Database.clientDB.query(text, values).then(res => {
          console.log(res.rows[0])
          message.channel.send("Enregistrement effectué avec succès ! Tu peux désormais utiliser les fonctionnalités liées aux Pokémons !")
        }).catch(e => console.error(e.stack));

      }

      // ?xp : consulter son XP
      if (message.content.toLocaleLowerCase().startsWith(BotConfig.prefix + 'xp')) {
        Database.getCol(message.author.id, 'xp').then(xp => {
          message.channel.send("Tu as actuellement " + xp + " XP.")
        }).catch(e => {
          message.channel.send("Une erreur est survenue dans la lecture de ton XP : as-tu effectué ton enregistrement avec `?register` ?")
        })
      }

      // ?bal : consulter son argent
      if (message.content.toLocaleLowerCase().startsWith(BotConfig.prefix + 'bal')) {
        Database.getCol(message.author.id, 'balance').then(bal => {
          message.channel.send("Tu as actuellement " + bal + " poképièces.")
        }).catch(e => {
          message.channel.send("Une erreur est survenue dans la lecture de ton argent : as-tu effectué ton enregistrement avec `?register` ?")
        })
      }

      // ?stats : les statistiques d'un compte
      if (message.content.toLocaleLowerCase().startsWith(BotConfig.prefix + 'stats')) {
        let normal = "0";
        let shiny = "0";
        let legendary = "0";
        let mythical = "0";
        let ultraBeast = "0";

        Database.getCol(message.author.id, 'nb_caught').then(val => {
          normal = val;

          Database.getCol(message.author.id, 'nb_shinies').then(val => {
            shiny = val;

            Database.getCol(message.author.id, 'nb_legendaries').then(val => {
              legendary = val;

              Database.getCol(message.author.id, 'nb_mythicals').then(val => {
                mythical = val;

                Database.getCol(message.author.id, 'nb_ultra_beasts').then(val => {
                  ultraBeast = val;

                  statsEmbed = new MessageEmbed().setColor("#FFFF00")
                                        .setTitle("Statistiques de " + message.member.displayName)
                                        .setDescription("Nombre de Pokémons attrapés")
                                        .setThumbnail(message.author.displayAvatarURL({'format': 'png', 'dynamic': true, 'size': 2048}))
                                        .addFields(
                                          { name: 'Normaux', value: normal, inline: true },
                                          { name: 'Légendaires', value: legendary, inline: true },
                                          { name: 'Fabuleux', value: mythical, inline: true },
                                          { name: 'Ultra-chimères', value: ultraBeast, inline: true },
                                          { name: 'Shinies', value: shiny, inline: true },
                                          { name: '\u200b', value: '\u200b', inline: true }
                                        )
                  message.channel.send({ embeds: [statsEmbed]})
                })
              })
            })
          })
        }).catch(e => {
          message.channel.send("Une erreur est survenue dans la lecture de tes stats : as-tu effectué ton enregistrement avec `?register` ?")
        })
      }

      // Help
      if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'help')) {
        message.channel.send(
          '```\n' +
          'Toutes les commandes commencent par "' + BotConfig.prefix + '"\n' +
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
          'pokemon                    : invoque un Pokémon au hasard parmi les 905 Pokémons (1G-8G). 1 chance sur 20 qu\'il soit chromatique\n' +
          'stats                      : affiche tes statistiques sur tes invocations de Pokémons\n' +
          'xp                         : affiche ton XP accumulée avec les invocations de Pokémons\n' +
          'bal                        : affiche tes Poképièces accumulées avec les invocations de Pokémons\n' +
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
      if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'ping')) {
        message.channel.send('Pong :+1:')
      }

      // Cookie
      if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'cookie')) {
        message.channel.send("Voilà un cookie pour toi, " + message.author.toString() + " : :cookie:")
      }

      // Lea
      if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'lea')) {
        message.channel.send('https://media.discordapp.net/attachments/801099428332699709/808096306744655872/Lea_et_son_placard.gif')
      }

      // DLB
      if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'dlb')) {
        message.channel.send('https://media.discordapp.net/attachments/632239527745945606/930919265043886180/vous_ne_me_meritez_pas.gif')
      }

      // Avatar
      if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'avatar')) {
        message.channel.send(message.author.displayAvatarURL({'format': 'png', 'dynamic': true, 'size': 2048}));
      }

      // Sexe (spéciale pour AA)
      if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'sexe')) {
        message.channel.send(':rolling_eyes:')
      }

      // Issou
      if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'issou')) {
        message.channel.send('https://tenor.com/view/issou-drole-marrant-rire-rigoler-gif-6142116')
      }

      // Pokémon
      if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'pokemon')) {
        let idPoke = Functions.getRandomInt(BotConfig.nombrePokemons) + 1;
        let diffSexe = Pokemon.pokemons[idPoke][5];
        let fabuleux = Pokemon.pokemons[idPoke][6];
        let legendaire = Pokemon.pokemons[idPoke][7];
        let ultraChimere = Pokemon.pokemons[idPoke][8];
        let evolveTo = Pokemon.pokemons[idPoke][9];
        let evolveFrom = Pokemon.pokemons[idPoke][10];
        let numShiny = Functions.getRandomInt(20) + 1;
        let numSexe  = Functions.getRandomInt(2) + 1;
        let texte;
        let now = parseInt(+Date.now()/1000);
        Database.getCol(message.author.id, 'timestamp').then((time) => {

          if (time === "" || now >= time) {

            let xp = 0;
            let bal = 0;

            // Le Pokémon est fabuleux
            if (fabuleux == 1) {

              // Gestion des récompenses
              xp = 500
              bal = 1500

              // On incrémente le compteur de fabuleux attrapés
              Database.addCol(message.author.id, 'nb_mythicals', 'int', 1)

              // Si Pokémon chromatique, on incrémente le compteur des chromatiques et on
              // octroie un bonus de 500 à l'XP et aux Poképièces
              if (numShiny != 20) {
                texte = message.member.displayName + ' a invoqué un fabuleux **' + Pokemon.pokemons[idPoke][2] + '** !';
                Database.addCol(message.author.id, 'xp', 'int', xp)
                Database.addCol(message.author.id, 'balance', 'float', bal)
              } else {
                texte = ':sparkles: ' + message.member.displayName + ' a invoqué un fabuleux **' + Pokemon.pokemons[idPoke][2] + ' chromatique** ! :sparkles:';
                Database.addCol(message.author.id, 'nb_shinies', 'int', 1)
                Database.addCol(message.author.id, 'xp', 'int', xp + 500)
                Database.addCol(message.author.id, 'balance', 'float', bal + 500)
                xp += 500
                bal += 500
              }

            // Le Pokémon est légendaire
            } else if (legendaire == 1) {

              // Gestion des récompenses
              xp = 350
              bal = 1000

              // On incrémente le compteur de légendaires attrapés
              Database.addCol(message.author.id, 'nb_legendaries', 'int', 1)

              // Si Pokémon chromatique, on incrémente le compteur des chromatiques et on
              // octroie un bonus de 200 à l'XP et aux Poképièces
              if (numShiny != 20) {
                texte = message.member.displayName +  ' a invoqué un légendaire **' + Pokemon.pokemons[idPoke][2] + '** !';
                Database.addCol(message.author.id, 'xp', 'int', xp)
                Database.addCol(message.author.id, 'balance', 'float', bal)
              } else {
                texte = ':sparkles: ' + message.member.displayName + ' a invoqué un légendaire **' + Pokemon.pokemons[idPoke][2] + ' chromatique** ! :sparkles:';
                Database.addCol(message.author.id, 'nb_shinies', 'int', 1)
                Database.addCol(message.author.id, 'xp', 'int', xp + 200)
                Database.addCol(message.author.id, 'balance', 'float', bal + 200)
                xp += 200
                bal += 200
              }

            // Le Pokémon est une ultra-chimère
            } else if (ultraChimere == 1) {

              // Gestion des récompenses
              xp = 200
              bal = 750

              // On incrémente le compteur d'ultra-chimères attrapées
              Database.addCol(message.author.id, 'nb_ultra_beasts', 'int', 1)

              // Si Pokémon chromatique, on incrémente le compteur des chromatiques et on
              // octroie un bonus de 100 à l'XP et aux Poképièces
              if (numShiny != 20) {
                texte = message.member.displayName + ' a invoqué une ultra-chimère **' + Pokemon.pokemons[idPoke][2] + '** !';
                Database.addCol(message.author.id, 'xp', 'int', xp)
                Database.addCol(message.author.id, 'balance', 'float', bal)
              } else {
                texte = ':sparkles: ' + message.member.displayName + ' a invoqué une ultra-chimère **' + Pokemon.pokemons[idPoke][2] + ' chromatique** ! :sparkles:';
                Database.addCol(message.author.id, 'nb_shinies', 'int', 1)
                Database.addCol(message.author.id, 'xp', 'int', xp + 100)
                Database.addCol(message.author.id, 'balance', 'float', bal + 100)
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
              Database.addCol(message.author.id, 'nb_caught', 'int', 1)

              // Si Pokémon chromatique, on incrémente le compteur des chromatiques et on
              // octroie un bonus de 100 à l'XP et aux Poképièces
              if (numShiny !== 20) {
                texte = message.member.displayName + ' a invoqué un **' + Pokemon.pokemons[idPoke][2] + '** !';
                Database.addCol(message.author.id, 'xp', 'int', xp)
                Database.addCol(message.author.id, 'balance', 'float', bal)
              } else {
                texte = ':sparkles: ' + message.member.displayName + ' a invoqué un **' + Pokemon.pokemons[idPoke][2] + ' chromatique** ! :sparkles:';
                Database.addCol(message.author.id, 'nb_shinies', 'int', 1)
                Database.addCol(message.author.id, 'xp', 'int', xp + 100)
                Database.addCol(message.author.id, 'balance', 'float', bal + 100)
                xp += 100
                bal += 100
              }

            }

            // On met à jour le timestamp
            let timestamp = parseInt(now) + 300;
            Database.setCol(message.author.id, 'timestamp', timestamp);

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
                  photo = new MessageAttachment('./img_poke/normal/' + idPoke + '_m.png', idPoke + '.png');

                } else {

                  // Femelle
                  photo = new MessageAttachment('./img_poke/normal/' + idPoke + '_f.png', idPoke + '.png');

                }

              } else {

                // Aucune différence de sexe
                photo = new MessageAttachment('./img_poke/normal/' + idPoke + '.png', idPoke + '.png');

              }
              
            } else {

              // Si le Pokémon possède une différence en fonction du sexe, on adapte l'image
              if (diffSexe === "1") {

                if (numSexe === 1) {

                  // Mâle
                  photo = new MessageAttachment('./img_poke/shiny/' + idPoke + '_m.png', idPoke + '.png');

                } else {

                  // Femelle
                  photo = new MessageAttachment('./img_poke/shiny/' + idPoke + '_f.png', idPoke + '.png');

                }

              } else {

                // Aucune différence de sexe
                photo = new MessageAttachment('./img_poke/shiny/' + idPoke + '.png', idPoke + '.png');

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
            message.channel.send({ embeds: [result], files: [photo] })
  
          } else {

            message.channel.send("Minute papillon ! Tu dois attendre <t:" + time + ":t> avant de réinvoquer un Pokémon !");

          }

        }).catch(e => {
          // message.channel.send("Une erreur est survenue dans la lecture de tes stats : as-tu effectué ton enregistrement avec `?register` ?")
          message.channel.send(e.message);
        })
      }

      // Random
      if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'random')) {
        let choix = message.content.substring(8).split(',')
        

        if (choix.length == 1 && choix[0] == '') {
          message.channel.send(":information_source: Utilisation: ?random choix1,choix2,...,choixN")
        } else if (choix.length == 1) {
          message.channel.send(":white_check_mark: Je choisis : " + choix[0] + " (petit rigolo ...)")
        } else {
          let idChoix = Functions.getRandomInt(choix.length);
          message.channel.send(":white_check_mark: Je choisis : " + choix[idChoix])
        }
      }

      // API GIPHY
      if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'gif')) {

        // Regarde si la commande possède un argument
        let count = message.content.toLowerCase().split(' ').length

        if (count >= 2) {

          let arg = message.content.toLowerCase().split(' ')[1]

          Axios.get('http://api.giphy.com/v1/gifs/random?tag=' + arg, {
            headers: { 'api_key': BotConfig.giphyToken }
          }).then((response) => {
            message.channel.send(response['data']['data']['url'])
          }, (response) => {
            console.log('Erreur')
          })

        } else {

          Axios.get('http://api.giphy.com/v1/gifs/random', {
            headers: { 'api_key': BotConfig.giphyToken }
          }).then((response) => {
            message.channel.send(response['data']['data']['url'])
          }, (response) => {
            console.log('Erreur').catch(err => console.logs(err))
          })

        }
      }

      // API YouTube
      if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'ytb')) {

        // Regarde si la commande possède un argument
        let count = message.content.toLowerCase().split(' ').length

        if (count >= 2) {

          let keyword = message.content.toLowerCase().split(' ')[1]

          Axios.get('https://www.googleapis.com/youtube/v3/search?key=' + BotConfig.youtubeToken + '&channelId=' + BotConfig.youtubeChanelId + '&maxResults=' + BotConfig.maxResultYtb + '&q=' + keyword)
            .then((response) => {
              if (response['data']['items'].length != 0) {
                message.channel.send('https://www.youtube.com/watch?v=' + response['data']['items'][0]['id']['videoId'])
              } else {
                message.channel.send('Je n\'ai rien trouvé... :frowning:\nEssaie sans accent !!')
              }
            }, (response) => {
              console.log('Erreur')
            }
          )

        } else {

          Axios.get('https://www.googleapis.com/youtube/v3/search?key=' + BotConfig.youtubeToken + '&channelId=' + BotConfig.youtubeChanelId + '&maxResults=' + BotConfig.maxResultYtb)
            .then((response) => {
              let idVideo = Functions.getRandomInt(response['data']['items'].length) + 1;
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
          if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'cookie')) {
            message.channel.send(author.toString() + ' s\'offre un cookie ! :cookie:')
          }

          // Avatar
          if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'avatar')) {
            message.channel.send(author.displayAvatarURL({'format': 'png', 'dynamic': true, 'size': 2048}));
          }

        } else {

          // Cookie
          if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'cookie')) {
            message.channel.send(author.toString() + ' offre un cookie à ' + mention.toString() + ' ! :cookie:')
          }

          // Avatar
          if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'avatar')) {
            message.channel.send(mention.displayAvatarURL({'format': 'png', 'dynamic': true, 'size': 2048}));
          }

        }

      // 2 ou plus
      } else {

        // Cookie
        if (message.content.toLowerCase().startsWith(BotConfig.prefix + 'cookie')) {
          message.channel.send('Cookie pour tout le monde !!! :cookie::cookie::cookie:')
        }
      }
    }
  }
})

// Mot dans les messages
discordClient.on("message", message => {

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

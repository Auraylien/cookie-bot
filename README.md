# Le Cookie Bot

Le Cookie Bot est un bot Discord écrit avec la librairie [discord.js](https://discord.js.org/#/) en JavaScript à l'aide
de la librairie [Node.js](https://nodejs.org/fr/). Il est hébergé sur une instance de [Heroku](https://www.heroku.com/)
qui utilise en plus une base de données PostgreSQL.

# Installation

Vous devez utiliser __au minimum__ Node.js **en version 16**.

Afin de travailler en local, vous aurez besoin d'une base de données PostgreSQL, que vous pourrez émuler grâce à [Docker](https://www.docker.com/).

Installez d'abord les dépendances avec `npm` :

```bash
> npm install
```

Modifiez le fichier `docker-compose.yml` en changeant `POSTGRES_USER` et `POSTGRES_PASSWORD` par les valeurs de votre choix.
Modifiez également `<user>` et `<password>` dans le fichier `start.sh` en mettant les mêmes valeurs que pour le `docker-compose.yml`.

Lancez ensuite les conteneurs :

```bash
> docker-compose -p cookie-bot up -d
```

Un Adminer sera accessible à <http://localhost:8080> pour vous permettre d'accéder au contenu de votre base de données.

Pour démarrer le bot, lancez le script :

```bash
> chmod +x ./start.sh # si problème de droits
> ./start.sh
```

Pour pouvoir ajouter le bot à votre serveur Discord, vous devez d'abord créer un bot dans le panneau des développeurs Discord,
puis l'ajouter à votre serveur. Un guide détaillé sur la marche à suivre : <https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js-fr>.

# Paramètres du bot

Pour qu'il puisse fonctionner, le bot nécessite certains tokens et clés d'API. Tous ces paramètres sont modifiables directement
dans le fichier `bot_config.js`.

* `discordToken` : le token généré depuis le panneau des développeurs Discord, essentiel pour faire fonctionner le bot
* `discordClientID` : le clientID de votre bot (disponible sur le panneau des développeurs Discord)
* `giphyToken` : le token de Giphy pour pouvoir faire des appels à l'API Giphy et récupérer des GIF
* `youtubeToken` : le token de Google (à générer sur le panneau des développeurs Google) pour utiliser l'API de YouTube
* `youtubeChanelId` : l'identifiant de votre chaîne YouTube, pour utiliser l'API YouTube (trouvable dans YouTube Studio)
* `connectionString` : le DSN de connexion à la base de données (à ne pas toucher une fois la config initiale effectuée)
* `maxResultYtb` : nombre de résultats maximum retourné par l'API YouTube (compris entre 0 et 50)
* `nombrePokemons` : nombre de Pokémons que vous pouvez invoquer avec le bot (**attention à ne pas aller au-delà de la limite du CSV**)

# Commandes disponibles

Toutes les commandes utilisent désormais la fonctionnalité d'interaction Discord avec les commandes slash (/).

* `help` : affiche de l'aide sur le bot
* `ping` : répond un message "pong", essentiellement pour tester si le bot fonctionne
* `cookie @user` : offrir un cookie à quelqu'un
* `avatar @user` : affiche l'avatar de quelqu'un
* `gif` : envoie un GIF aléatoire
* `gif <mot-clé>` : envoie un GIF relatif au mot-clé (enfin, presque)
* `random <1> <2> ... <10>` : fait un choix au hasard entre <1>, <2>, ... et <10> maximum
* `ytb` : envoie une vidéo au hasard de la chaîne YouTube configurée
* `ytb <mot-clé>` : envoie une vidéo de la chaîne YouTube configurée (enfin, presque)
* `pokemon` : mini-jeu d'invocation de Pokémon, comprenant les commandes :
* * `register` : enregistrement pour utiliser les fonctions liées aux Pokémon
* * `stats` : affiche tes statistiques sur tes invocations de Pokémon
* * `xp` : affiche ton XP accumulée avec les invocations de Pokémon
* * `bal` : affiche tes Poképièces accumulées avec les invocations de Pokémon
* * `invocation` : invoque un Pokémon au hasard parmi les 905 Pokémon (1G-8G), avec 1 chance sur 20 qu'il soit chromatique

\+ d'autres commandes plus spécifiques qui peuvent facilement être rajoutées en suivant le schéma du fichier `index.js` pour les
commandes déjà existantes.

# Changelog

* 3.0 - 28/08/2022 - Passage aux commandes Slash, suppression de certaines variantes de certaines commandes, suppression des réactions aux messages du bot, ajout d'une fonction de log des utilisations du bot
* 2.0 - 19/07/2022 - Ajout de la gestion de l'XP et des Poképièces, images de Pokémon HOME, refonte du message d'invocation
* 1.1 - 22/02/2022 - Mise à jour sur l'invocation des Pokémons
* 1.0 - 31/01/2022 - Ajout de la fonctionnalité d'invocation des Pokémons
* 0.5 - 30/08/2021 - Ajout de diverses commandes
* 0.0 - 01/05/2021 - Création du bot de base

---

Version du bot : 3.0  
Date du README : 28/08/2022
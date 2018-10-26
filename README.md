<div align="center">

  ![alt text](https://i.imgur.com/UfeBmAp.gif "logo")

  <h1>Connect With Gamers</h1>
</div>
<p align="center">
    <a href="https://travis-ci.org/ShawnAndrews/ConnectWithGamers" alt="Build Status">
        <img src="https://travis-ci.org/ShawnAndrews/ConnectWithGamers.svg?branch=master" /></a>
    <a href="http://connectwithgamers.com/" alt="connectwithgamers.com">
        <img src="https://img.shields.io/website-up-down-green-red/http/shields.io.svg" /></a>
    <a href="https://david-dm.org/shawnandrews/connectwithgamers" alt="David">
        <img src="https://david-dm.org/shawnandrews/connectwithgamers.svg" /></a>
    <a href="https://github.com/ShawnAndrews/ConnectWithGamers" alt="GitHub release">
        <img src="https://img.shields.io/github/release/shawnandrews/connectwithgamers.svg" /></a>
    <a href="https://github.com/ShawnAndrews/ConnectWithGamers/blob/master/LICENSE" alt="GitHub license">
        <img src="https://img.shields.io/github/license/shawnandrews/connectwithgamers.svg" /></a>
</p>
<div align="center">
  :video_game::space_invader::game_die::speech_balloon:
</div>
<div align="center">
  <strong>Discover new games today!</strong>
</div>
<div align="center">
  A games library and mobile chat application.
</div>

<div align="center">
  <h3>
    <a href="http://www.connectwithgamers.com">
      Website
    </a>
    <span> | </span>
    <a href="http://www.saportfolio.ca">
      Portfolio
    </a>
  </h3>
</div>

<div align="center">
  <sub>By Shawn Andrews</sub>
</div>

## Table of Contents
- [Features](#features)
- [Updates](#updates)
- [Config](#config)
- [Dependencies](#dependencies)
- [Migrations](#migrations)
- [Installation](#installation)
- [Run](#run)
- [FAQ](#faq)
- [License](#license)

## Features
- Search games: Find related games by searching its name, like Zelda.
- View recently released games: Look at which games have been released the past month.
- View upcoming games: Discover new and exciting games soon to be released and on which platform.
- View popular games by platform: Filter games by the most popular PC, console, and handheld platform.
- Up-to-date Steam price: Keep notified with new discounts to get the best possible price.
- 84,000 Games - One of the largest collection of games is at your fingertips.
- 5-star reviews - Pick the best game for you based on actual user reviews.
- Global Chatroom - Talk with fellow gamers about exciting new releases with all your favorite emojis and custom emotes.
- Linked gaming platforms - Link your gaming profiles such as Twitch, Discord and Steam so people know where to find you.

<br/>

<p align="center">
  <img src="https://i.imgur.com/exqpFMi.png" />
</p>

<p align="center">
  <img src="https://i.imgur.com/iA1LvXm.png" />
</p>

## Updates

<details>
  <summary>View patch notes</summary>
  
  
> v1.0
> 
> - Initial release
>
> v1.1
> 
> - Account login
>     * Updated login, signup button
>     * Updated Remember Me slider
> - Account Settings
>     * Added ability to change password
>     * Changed saving individual settings into one save button
>     * Added ability to Add/Update/Delete profile pictures
>          * Using Imgur image hosting
>     * Added slider to expand and collapse gaming links
> - Chatroom
>     * Added text to show if message was Today, Yesterday, etc for improved readability
>     * Added iMessage chat bubbles
>          * Clickable to show time stamp
>     * Updated send bar to send messages
>     * Updated screen to view users in chatroom
>          * Updated UI
>          * Added text to show how long ago was the last activity of a user
> - Menu
>     * Added Game Trailer vidoes
>     * Added Steam Reviews
>     * Added ability to search games by genre
>     * Changed Popular Games By Platform to Exclusive Games By Platform
>     * Added Read More for long summaries for improved readability
>     * Added clickable platforms and genres
>
> v1.2
>
> - Chatroom
>     * Added top and side nav bar
>     * Moved User List to side nav
>          * Updated user list UI
>          * Added multi-bubble for subsequent messages from the same person
>          * Added ability to use pictures in messages
> - Menu
>     * Updated Game Screen UI
> - Account
>     * Added email verification
>          * Email sent on account creation and resent on request
> - Other
>     * Added SSL support
>     * Code cleanup
>          * Add comments
>          * Split heavy files into smaller ones
>          * Seperate components into container and presentational components
>
> v1.3
>
> - Menu
>     * Added Gaming Profiles
>          * Ability to view your followed live Twitch streams
>          * Ability to view your Steam friends list
>          * Ability to copy your Discord server's link to send to friends
>
> v1.4
>
> - Login
>     * Updated login screen to be fullscreen
> - Chatroom
>     * Updated chatrooms
>          * Severals new channels for the most popular video games
>     * Added user list bar
>          * Ability to see other user's time of most recent activity
>          * Ability to click on a user for more detailed information
>     * Added search feature
>          * Find users by name for more detailed information
>     * Added settings feature
>          * View all emotes available and who uploaded them
>          * Create your own custom emote
>     * Updated messaging
>          * Ability to use Emojis, Animated Emojis, and image attachments
</details>

## Config
Create a file called ``config.ts`` in the root directory based off the default settings located in configTemplate.ts.

```
import { Config } from "./client/client-server-common/common";

const config: Config = { 
... 
};

export default config;
```

SSL information: If you plan to use SSL set "useStrictlyHttps:true" and "https: { key: `<path-to-key>.pem`, cert: `<path-to-certificate>.crt`, ca: `<path-to-bundle>.ca-bundle` }" to the appropriate paths in the config file.

As well, create a file called ``database.json`` in the root directory based off the default settings located in databaseTemplate.json and ensure these values match those for the database property in config.ts.

## Dependencies
Apart from the included NPM packages, there are additional components and API's required to run this program without error.
- Redis: This is required to save API calls to IGDB in memory.
- MySQL Server: This is required to save Accounts, Authenticaiton Tokens, Chat Emotes, and Chatroom Messages.
- IGDB: You are required to have an IGDB account with a valid API key present in the config file to perform API queries.
- Imgur: You are required to have a valid Imgur API key.
- Steam: No API key is required for the current application's requests.
- SMTP: For account email verification you must set valid SMTP account credentials via the config property "smtp".

## Migrations
Setting up the database requires the following steps:

- Start your MySQL server.
- Ensure the database account and connection information located in database.json and config.ts matches eachother.
- Run the following commands in the root directory to create the database and necessary tables.

```
db-migrate db:create connectwithgamers
db-migrate up --config database.json -e prod
```

## Installation
How do i run this website on my own?
- Ensure your MySQL server is running and you have a copy of the database using the [Migrations](#migrations) guide.
- Ensure your Redis server is running.
- Ensure your HTTP, HTTPS(if enabled) and Chat server ports are forwarded.
- You may now access the website via ``localhost``.

## Run

- Install

Execute the following commands to install npm packages for the client and server:
```
cd client
npm install
cd ..
npm install
```

- Build

To build the project using webpack and compile the typescript, execute the following commands:
```
cd client
npm run client-prod
cd ..
npm run server-prod
```

This will build the production version of the client, server and chat server in the respective ``/dist`` folder.

- Run

You have two options for running the server. The first involves a single process handling requests, and the other is cluster mode which will create duplicate processes on each CPU core and spread requests across them to improve CPU task performance.

#1 (non-cluster mode): 

- Shell #1 ```npm run server```
- Shell #2 ```npm run chat-server```

#2 (cluster mode):

- Shell #1 ```node runcluster.js```
- Shell #2 ```npm run chat-server```

This will start running the HTTP/HTTPS web and chat server. You may now access the site via localhost.

## FAQ
### Why is it called Connect With Gamers?
This website was designed to encourage fellow gamers to meet by talking in chat, viewing each others gaming profile, and giving them a library of games to talk about.

### Do you have other projects i can check out?
Of course! You can check them out on my portfolio website at [saportfolio.ca](http://www.saportfolio.ca)

### Where can i get a copy of the database?
Use my [Migrations](#migrations) guide located above.

## License
[MIT](https://tldrlegal.com/license/mit-license)

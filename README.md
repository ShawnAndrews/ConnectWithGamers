<div align="center">

  ![alt text](https://i.imgur.com/UfeBmAp.gif "logo")

  <h1>Connect With Gamers</h1>
</div>
<p align="center">
    <a href="https://travis-ci.org/ShawnAndrews/ConnectWithGamers" alt="Build Status">
        <img src="https://travis-ci.org/ShawnAndrews/ConnectWithGamers.svg?branch=master" /></a>
    <a href="https://codecov.io/gh/ShawnAndrews/ConnectWithGamers/" alt="Build Status">
        <img src="https://codecov.io/gh/shawnandrews/connectwithgamers/branch/master/graph/badge.svg" /></a>
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
  A games library and chat application.
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
- [Testing](#testing)
- [Installation](#installation)
- [Run](#run)
- [FAQ](#faq)
- [License](#license)

## Features
- Store: View discounted, upcoming and recently released video games across PC, consoles and handhelds.
- Pricing: Compare up-to-date prices and discounts between popular marketplaces such as Steam, GoG, Microsoft, IOS and Android.
- Library: Import games from Steam and manually add games from other platforms.
- Run games: Start playing any game on your computer in a single click without the need for multiple clients like BattleNet, Steam or Uplay.
- Reviews and 5-star ratings - Read reviews and rate the games you like or dislike.
- Global Chatroom - Talk with fellow gamers about exciting new releases with all your favorite emojis and custom emotes!
- Linked gaming profiles - Link your gaming profiles such as Twitch, Discord and Steam so people can add you.
- 192,000 Games - The largest collection of video games to explore provided by IGDB.
- Search games: Find games across all platforms by searching their name, like Zelda.

<br/>

<p align="center">
  <br>
  <img src="https://cdn.discordapp.com/attachments/507670507433361473/530260603567341570/h.png" />
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
>
> v1.5
>
> - Login
>     * Added back button
> - Menu
>     * Updated promotional infographic
>     * Updated to include news popular, upcoming and recent games as well as gaming news articles
>     * Added Advanced Search feature
>          * Includes 4 filters, Popularity, Category, Genre and Platform
>          * Includes sorting by Release Date, Popularity, and Alphabetic
>          * Easy to use simply by swiping left on any menu screen
>     * Updated results screen
>          * Increased games shown to 50
>          * Updated game information to include pricing, genres and steam link (where applicable)
>
> v1.6
>
> - Added fully-responsive across all devices
> - Redesigned UI
>
> v2.0 (Coming Soon)
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

Follow the same routine for creating a file called ``database.json`` in the root directory based off the default settings located in databaseTemplate.json and ensure these values match those for the database property in config.ts.

SSL information: If you plan to use SSL set "useStrictlyHttps:true" and "https: { key: `<path-to-key>.pem`, cert: `<path-to-certificate>.crt`, ca: `<path-to-bundle>.ca-bundle` }" to the appropriate paths in the config file.

## Dependencies
Apart from the included NPM packages, there are additional components and API's required to run this program without error.
- MySQL Server: This is required to save Accounts, Authenticaiton Tokens, Chat Emotes, Chatroom messages, and Games.
- IGDB: You are required to have an IGDB account with a valid v3 API key present in the config file to perform API queries.
- SMTP: For account recovery and email verification you must set valid SMTP account credentials via the config property "smtp".

## Testing
Back-end unit testing on the NodeJS server uses Mocha, Nyc, Istanbul and is available through the following script:

```
npm run test-with-coverage
```

In addition to the text summary, an html coverage report will be generated in /coverage/lcov-report/index.html

## Installation
How do i run this website on my own?
- Ensure your MySQL server is running and ask the admin (Shawn Andrews) for a copy of the latest database schema.
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
Ask the admin (Shawn Andrews) for a copy of the latest database schema.

### How was this project developed?
Using React, Bootstrap, Redux, NodeJS, Mocha, MySQL, and SocketIO.

## License
[MIT](https://tldrlegal.com/license/mit-license)

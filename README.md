<div align="center">

  ![alt text](https://i.imgur.com/obqCKhX.png "logo")

  <h1>Connect With Gamers</h1>
</div>

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
    <a href="https://www.connectwithgamers.com">
      Website
    </a>
    <span> | </span>
    <a href="https://www.saportfolio.ca">
      Portfolio
    </a>
  </h3>
</div>

<div align="center">
  <sub>By Shawn Andrews</sub>
</div>

## Table of Contents
- [Features](#features)
- [Config](#config)
- [Dependencies](#dependencies)
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
- Global Chatroom - Talk with fellow gamers about exciting new releases with all your favorite emojis.
- Linked gaming platforms - Link your gaming profiles such as Twitch, Discord and Steam so people know where to find you.

<br/>

![alt text](https://i.imgur.com/10UUUmo.png "infographic")

## Config
Create a git-ignored file called ``config.ts`` in the ``/`` directory with the following contents, including the requried properties of the Config interface.

```
import { Config } from "./client/client-server-common/common";

const config: Config = { 
... 
};

export default config;
```

## Dependencies
Apart from the included NPM packages, there are a couple extra components required to run Connect With Gamers without error.
- Redis: This is required to save API calls to IGDB in memory.
- SQL Server: This is required to save Accounts, Authenticaiton Tokens, and Chatroom Messages.
- IGDB: You are required to have an IGDB account with a valid API key present in the config file to perform API queries.

## Installation
How do i run this website on my own?
- Make sure your SQL Server database is running on the default port and you imported the schema from [here](http://www.saportfolio.ca/cwgschema.bacpac).
- Make sure your Redis server is up and running.
- Make sure your HTTP and Chat server ports are forwarded. This is defaulted to 80 and 81, respectively.
- You may now access the website via ``localhost``.

## Run
Start running the HTTP and Chat server by executing the following command in the ``/`` directory.

```npm run server-client```

This will build the production version of the client and server in the respective ``/dist`` folder then run the server.

## FAQ
### Why is it called Connect With Gamers?
This website was desgigned to encourage fellow gamers to meet by talking in chat, viewing each others gaming profile, and giving them a library of games to talk discuss.

### Do you have other projects i can check out?
Of course! You can check them out on my portfolio website at [saortfolio.ca](http://www.saportfolio.ca/cwgschema.bacpac)

## License
[MIT](https://tldrlegal.com/license/mit-license)

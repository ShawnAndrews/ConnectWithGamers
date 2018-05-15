<div align="center">

  ![alt text](https://i.imgur.com/obqCKhX.png "logo")

  <h1>Connect With Gamers (v1.3)</h1>
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

![alt text](https://i.imgur.com/HDz7PYf.png "screenshots")

## Updates

<h3>Version 1.0</h3>

- Initial release

<h3>Version 1.1<h3>

<details> 
  <summary>Expand to read patch notes</summary>
<h4>Account login</h4>

- Updated login, signup button
- Updated Remember Me slider

<h4>Account Settings</h4>

- Added ability to change password
- Changed saving individual settings into one save button
- Added ability to Add/Update/Delete profile pictures
    - Using Imgur image hosting
- Added slider to expand and collapse gaming links

<h4>Chatroom</h4>

- Added text to show if message was Today, Yesterday, etc for improved readability
- Added iMessage chat bubbles
    - Clickable to show time stamp
- Updated send bar to send messages
- Updated screen to view users in chatroom
    - Updated UI
    - Added text to show how long ago was the last activity of a user

<h4>Menu</h4>

- Added Game Trailer vidoes
- Added Steam Reviews
- Added ability to search games by genre
- Changed Popular Games By Platform to Exclusive Games By Platform
- Added Read More for long summaries for improved readability
- Added clickable platforms and genres
</details>

<h3>Version 1.2<h3>

<details> 
  <summary>Expand to read patch notes</summary>
<h4>Chatroom</h4>

- Added top and side nav bar
- Moved User List to side nav
    - Updated user list UI
    - Added multi-bubble for subsequent messages from the same person
    - Added ability to use pictures in messages

<h4>Menu</h4>

- Updated Game Screen UI

<h4>Account</h4>

- Added email verification
    - Email sent on account creation and resend
    - When changing emails, set new verification code
    
<h4>Other</h4>
    
- Added SSL support
- Code cleanup
    - Add comments
    - Split heavy files into smaller ones
    - Seperate components into container and presentational components
</details>

<h3>Version 1.3<h3>

<details> 
  <summary>Expand to read patch notes</summary>
<h4>Menu</h4>

- Added Gaming Profiles
    - Ability to view your followed live Twitch streams
    - Ability to view your Steam friends list
    - Ability to copy your Discord server's link to send to friends
</details>
    
## Config
Create a git-ignored file called ``config.ts`` in the ``/`` directory with the following contents, including the requried properties of the Config interface.

```
import { Config } from "./client/client-server-common/common";

const config: Config = { 
... 
};

export default config;
```

SSL information: If you plan to use SSL set "useStrictlyHttps:true" and "https: { key: `keyPath.pem`, cert: `certPath.crt`, ca: `bundlePath.ca-bundle` }" to the appropriate paths in the config properties.

## Dependencies
Apart from the included NPM packages, there are a couple extra components required to run Connect With Gamers without error.
- Redis: This is required to save API calls to IGDB in memory.
- SQL Server: This is required to save Accounts, Authenticaiton Tokens, and Chatroom Messages.
- IGDB: You are required to have an IGDB account with a valid API key present in the config file to perform API queries.
- Imgur: You are required to have a valid Imgur API key.
- Steam: No API key is required for the current application's requests.
- SMTP: For account email verification you must set valid SMTP account credentials via the config property "smtp".

## Installation
How do i run this website on my own?
- Make sure your SQL Server database is running on the default port and you imported the schema from [v1.0](http://www.saportfolio.ca/ConnectWithGamersv10.bacpac) or [v1.1](http://www.saportfolio.ca/ConnectWithGamersv11.bak).
- Make sure your Redis server is up and running.
- Make sure your HTTP, HTTPS(if enabled) and Chat server ports are forwarded, if using on a live site.
- You may now access the website via ``localhost``.

## Run
Start running the HTTP and Chat server by executing "npm install" then the following command in the ``/`` directory:

```npm run server-client```

This will build the production version of the client and server in the respective ``/dist`` folder then run the server.
You may now access the site via localhost.

## FAQ
### Why is it called Connect With Gamers?
This website was desgigned to encourage fellow gamers to meet by talking in chat, viewing each others gaming profile, and giving them a library of games to talk discuss.

### Do you have other projects i can check out?
Of course! You can check them out on my portfolio website at [saportfolio.ca](http://www.saportfolio.ca)

## License
[MIT](https://tldrlegal.com/license/mit-license)

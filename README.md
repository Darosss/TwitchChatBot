# Twitch ChatBot

Twitch chat bot designed to be deployed on localhost and home LAN only.
It **SHOULD NOT** be on online hosting.

## Built with

- React.js
- Express.js
- MongoDB
- Socket.IO
- twurple
- moment
- tmi.js
- winston
- multer

## Getting started

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm

```
npm install npm@latest -g
```

- MongoDB Community Server installed and running on your local machine - https://www.mongodb.com/try/download/community

### Installation

1. Clone the repo

```sh
git clone https://github.com/Darosss/TwitchChatBot.git
```

2. From root folder navigate to `server` folder and install npm packages

```sh
cd server
npm install
```

3. From root folder navigate to `frontend` folder and install npm packages

```sh
cd frontend
npm install
```

### Configuration

The app requires several environment variables to be set in the `.env `file. You can use the `.env.example` _(should be in root directory)_ file as a template:<br>
_⚠️ Important Note: Please keep your environment variables secure and private! Do not commit them to version control, and do not share them publicly. Be sure to add your environment variables to a .env file in the root directory of your project, and add that file to your .gitignore file. If you are unsure about how to do this, please refer to the .env.example file in the root directory of this project._

```sh
# .env.example

# Server configuration
BACKEND_PORT=5000
DATABASE_CONNECT_URL=mongodb://127.0.0.1:27017/mychatbot

# Twitch application configuration

# Read below for CLIENT_ID / CLIENT_SECRET / REDIRECT_URL
CLIENT_ID=<twitch application client id>
CLIENT_SECRET=<twitch application client secret>
# REDIRECT_URL=<backend localhost with port>/auth/twitch/callback
REDIRECT_URL=http://localhost:5000/auth/twitch/callback



# This is for cors origin options
LOCAL_FRONTEND_URL=http://localhost:5173
HOST_FRONTEND_URL=http://192.168.0.100:5173



# Read below for BOT_PASSWORD / BOT_USERNAME / BOT_ID
BOT_PASSWORD=oauth:1234567890
BOT_USERNAME=botusername
BOT_ID=123456789

# Must be same as backend localhost:port if app isn't hosted or ip:port if app is hosted through LAN network
VITE_BACKEND_URL=http://192.168.0.100:5000
```

<sub> `CLIENT_ID` and `CLIENT_SECRET` - both can be obtained from twitch apllication: Read it here: https://dev.twitch.tv/docs/authentication/register-app/ <br>
`OAuth Redirect URLs` - in twitch app should have \<backend localhost with port>/auth/twitch/callback
<br>
`REDIRECT_URL` - must be same as **OAuth Redirect URLs** from app registered above <br>
`BOT_PASSWORD` - can be obtained by accesing Implicit grant flow. More information: https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#implicit-grant-flow<br>
`BOT_ID` - can be obtained from twitch api or any external site
</sub>

### Start

#### Start server

- navigate to server folder
  ```sh
    cd server
  ```
- then build

  ```sh
    npm build
  ```

- then run

  ```sh
    node ./dist/index.js
  ```

- OR you can too use nodemon as it will build and start server

  ```sh
    npm run dev
  ```

#### Start frontend

- navigate to frontend folder

  ```sh
    cd frontend
  ```

- navigate to frontend folder

  ```sh
    npm start
  ```

## Usage

Once the app is started, it will listen for incoming twitch chat messages on your local machine and respond accordingly depends on triggers / commands / messages / timers created earlier by you.

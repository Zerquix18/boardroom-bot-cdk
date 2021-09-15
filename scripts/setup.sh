#!/bin/bash

cd ~

sudo apt-get update -y
sudo apt-get install -y nodejs npm git
sudo npm install -g forever

# to be changed after moving to br's github
git clone https://github.com/Zerquix18/boardroom-discord-bot
cd boardroom-discord-bot

npm install
npm run tsc
# todo: set up env vars first
forever start bot.js

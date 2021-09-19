# ** this file runs as root!! **

cd ~

source .bashrc


apt-get update -y
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt-get install -y nodejs git
npm install -g forever

# to be changed after moving to br's github
git clone https://github.com/Zerquix18/boardroom-discord-bot
cd boardroom-discord-bot

npm install
npm run tsc
echo "BOT_TOKEN=$BOT_TOKEN" > .env
forever --uid="discord-bot" start bot.js

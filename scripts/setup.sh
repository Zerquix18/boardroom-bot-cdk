# ** this file runs as root!! **

cd ~

apt-get update -y

curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt-get install -y nodejs git unzip

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

npm install -g forever

# to be changed after moving to br's github
git clone https://github.com/Zerquix18/boardroom-discord-bot
cd boardroom-discord-bot

npm install
export NODE_OPTIONS=--max_old_space_size=4096
npm run tsc
echo "BOT_TOKEN=$BOT_TOKEN" > .env
forever --uid="discord-bot" start bot.js

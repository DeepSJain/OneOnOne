sudo apt-get update
sudo apt-get upgrade -y

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 20.11.1
nvm use 20.11.1

sudo apt-get install npm -y

npm install
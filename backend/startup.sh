sudo apt-get update
sudo apt-get upgrade -y

sudo apt install python3-venv -y
sudo apt install python3-pip -y

python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r OneOnOne/requirements.txt

python3 backend/main/manage.py makemigrations
python3 backend/main/manage.py migrate

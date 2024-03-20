sudo apt-get update
sudo apt-get upgrade
sudo apt install python3-venv
sudo apt install python3-pip
python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r OneOnOne/requirements.txt

python3 backend/main/manage.py makemigrations
python3 backend/main/manage.py migrate

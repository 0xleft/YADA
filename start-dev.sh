set -e

cp ./configs/docker-compose-dev.yml ./docker-compose.yml
sudo docker compose build
sudo docker compose up
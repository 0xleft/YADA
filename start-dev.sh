set -e

rm -rf ./frontent/node_modules/vite

cp ./configs/docker-compose-dev.yml ./docker-compose.yml
sudo docker compose build
sudo docker compose up
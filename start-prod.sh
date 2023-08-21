cp ./configs/docker-compose-prod.yml ./docker-compose.yml
cd ./frontend
npm run build
cd ..
sudo docker compose build
sudo docker compose up
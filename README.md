Figma designs link: https://www.figma.com/file/090d5mhtuqdi8WUq1QG2ox/YADA?type=design&node-id=0%3A1&mode=design&t=INvVls77JKctsczT-1

## Development setup

```bash
cp ./configs/docker-compose-dev.yml ./docker-compose.yml
./start.sh
```

## Production setup

```bash
cp ./configs/docker-compose-prod.yml ./docker-compose.yml
cd ./frontend
npm run build
cd ..
./start.sh
```
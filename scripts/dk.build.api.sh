#scripts/dk.build.sh
cd ..
# lsdocker build --force-rm -t citizenlabsgr/adopt-a-drain-hapi-api .
docker build -t citizenlabsgr/adopt-a-drain-hapi-api https://github.com/citizenlabsgr/adopt-a-drain-hapi-api.git#main
docker images 

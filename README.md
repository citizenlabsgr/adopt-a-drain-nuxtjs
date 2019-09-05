# Adopt a Drain (AAD)
Adopt a drain 
## Goals
* Single page application
* Static Website, should run on github or aws S3 
* Nuxtjs (extends VueJS )
* Docker-Compose enabled


## Developers
### Prerequisites
* A Google maps key, yes they ask for a credit card but wont bill you
    * goto  (https://developers.google.com/maps/documentation/javascript/get-api-key)
* A data.world account
    * goto data.world (https://data.world)
* A data.world API Token 
    * goto data.world (https://data.world)
    * find setting (icon upper right, to right of bell icon)
    * settings>advanced
    * API Token
* Clone this repo to your machine    
    
### Environment Variables 
Environment variables are stored in .env
```
# a map key, 
GOOGLE_MAPS_JAVASCRIPT_API_KEY=<get a key from google>
# Drain data is stored at data.world 
# data.world user
DW_USER=citizenlabs 
# data.world app key
DW_AUTH_TOKEN=<long-key>
# url to AAD
OPEN_SOURCE=https://api.data.world/v0/sql/citizenlabs/grb-storm-drains
```
### Docker Compose
```
# build once, fresh clones should be built
cd adopt-a-drain/adopt-a-drain-web/
docker-comopose build

# after build
cd adopt-a-drain/
docker-compose uo

# after development
docker-compose down

```
### Tests
https://jestjs.io 

```
open command window
cd adopt-a-drain/adopt-a-drain-web/
npm run test
```

### Run AAD
* open browser
* http://localhost:3000

### Tools
* editor: Atom
    * setting: fast-eslint

### 



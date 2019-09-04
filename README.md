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
* A data.world account
* A data.world API Token 
    * goto data.world ()
    * find setting (icon upper right, to right of bell icon)
    * settings>advanced
    * API Token
    
### Environment Variables
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


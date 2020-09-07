# Developer Setup
This is a the recommended setup, experienced git user may vary.
* [Manually Setup Folders and Files](#manually-setup-folders-and-files)
* [Optional Bash Setup Script](#optional-bash-setup-script)

## Manually Setup Folders and Files

```
+-- <your-development-folder>
    |
    +-- <your-branch-name>
        |
        +-- adopt-a-drain
            |-- .env
```
### Your Branch Name
GitHub has a nice feature such that using a # followed by an issue number will create a link to that issue.
For example, prefixing your branch name with #45, such as #45.update.reademe will help team members understand the relationship
between issue #45 and the reason for your branch (update.readme).
* use the issue number (eg #45) as prefix for your-branch-name

## Manual Setup
1. Folders
    ```
    # Folders
    mkdir <your-development-folder>/
    cd <your-development-folder>/

    mkdir <your-branch-name>/
    cd <your-branch-name>/

    ```

1. Clone Repo
    ```
    # from <your-branch-name> folder
    git clone https://github.com/Wilfongjt/adopt-a-drain.git
    ```
1. Create .env file in adopt-a-drain folder
    1. Cut and paste the following into .env
    ```
    # adopt-a-drain/.env

    # Google Map API (aad-web)
    GOOGLE_MAPS_API_KEY=<your-google-map-api-key>

    # Data.World API (aad-web)
    DW_AUTH_TOKEN=<your-data.world-authorization-token>
    DW_USER=citizenlabs
    DW_DRAIN_URL=https://api.data.world/v0/sql/citizenlabs/grb-storm-drains

    # Adopt-a-Drain (aad-web)
    AAD_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJDaXRpemVuLUxhYnMiLCJzdWIiOiJPcmlnaW4iLCJuYW1lIjoiQWRvcHQtYS1EcmFpbiIsInJvbGUiOiJndWVzdF9hYWQifQ.ML4Tmgv0jjwUzcqlxT3-Qcuk_vJpcgoXkni9IbdS4Wo
    AAD_API_URL=http://localhost:3100/rpc
    AAD_API_VERSION=aad_version_1_4_2
    LB_GUEST_PASSWORD=mysecretclientpassword
    LB_WODEN={"org":"CitizenLabs","app":"Adopt-A-Drain","name":"woden@citizenlabs.org","password":"a1A!aaaa"}

    # Postgres (aad-db)
    POSTGRES_DB=aad_db
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=mysecretdatabasepassword
    POSTGRES_JWT_SECRET=PASSWORDmustBEATLEAST32CHARSLONGLONG

    # Postgrest (aad-db)
    PGRST_DB_SCHEMA=aad_version_1_4_2
    PGRST_DB_ANON_ROLE=guest_aad
    ```
### Start Docker
    ```
    # open a command window
    # from the adopt-a-drain/ folder

    docker-compose build

    docker-compose up
    ```

### Stop Docker
    ```
    # open a command window
    # from the adopt-a-drain/ folder

    docker-compose down
    ```
### Start Adopt A Drain
    ```
    # when docker is up and running
    open -a safari http://localhost:3000
    ```

# Optional Bash Setup Script 
The bash setup script performs the following:
 * Creates a repo clone, when not already downloaded
 * Creates and checks out a local branch,
 * Builds a .env file,
 * Makes a config.sh utility script,
 * Makes a docker up utility script,
 * Makes a docker down utility script,

## Using the Setup Script
1. Create or set <your-development-folder>
1. Create a setup.sh script file:
    ```
    # from your-development-folder
    touch setup.sh
    ```
1. Cut and paste [**Setup Script Contents**](#setup-script-contents) into setup.sh
    1. Replace **<your-branch-name>** with your actual branch name in setup.sh
    1. Replace **<your-google-map-api-key>** with your actual key in setup.sh
    1. Replace **<your-data.world-authorization-token>** with your actual token in setup.sh
1. Make script executable:
    ```
    # from your-develoment-folder
    chmod 755 setup.sh
    ```
1. Run the script: ./setup.sh
    ```
    # from your-develoment-folder
    ./setup.sh
    ```

## Setup Script Output Folders and Files
Expected folders and some files
```
+-- your-development-folder
    |-- config.sh
    |-- setup.sh
    |-- config.sh
    |-- down.sh
    |-- up.sh
    +-- your-branch-name
        +-- adopt-a-drain
            |-- .env
```
## Start Docker
```
# open a command window
# from the adopt-a-drain/ folder
./up.sh
```
## Stop Docker
```
# open a command window
# from the adopt-a-drain/ folder
./down.sh
```
## Start Adopt A Drain
```
# from a command window
# when docker is up and running
open -a safari http://localhost:3000
```

## Setup Script Contents
```
# setup.sh
####################
# Required Configuration Changes
####################

export MY_BRANCH=<your-branch-name>
export GOOGLE_MAPS_API_KEY=<your-google-map-api-key>
export DW_AUTH_TOKEN=<your-data.world-authorization-token>

####################
# Optional Configuration Changes (good enough for develpment)
#####################

export GIT_PROJECT=adopt-a-drain
export GIT_PREFIX=aad
export GIT_OWNERNAME=Wilfongjt
export MY_DATA_FOLDER=~/.data/aad_db

####################
# Check for minimum configuration
####################
echo "GOOGLE_MAPS_API_KEY is ${GOOGLE_MAPS_API_KEY}"
if [ "${GOOGLE_MAPS_API_KEY}" = "" ]; then
    echo "GOOGLE_MAPS_API_KEY is ${GOOGLE_MAPS_API_KEY}"
    echo "Need Google Map token."
    exit 0
fi
echo "DW_AUTH_TOKEN is ${DW_AUTH_TOKEN}"
if [ "${DW_AUTH_TOKEN}" = "" ]; then
    echo "DW_AUTH_TOKEN is ${DW_AUTH_TOKEN}"
    echo "Need Data.World token."
    exit 0
fi
echo "MY_BRANCH is ${MY_BRANCH}"
if [ "${MY_BRANCH}" = "" ]; then
    echo "Need a GitHub Branch name. (#<issue-no>.<short-description>)"
    exit 0
fi
##################################
## config.sh (generate a script)
####################
echo "export MY_BRANCH=${MY_BRANCH}" > config.sh
echo "export GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}" >> config.sh
echo "export DW_AUTH_TOKEN=${DW_AUTH_TOKEN}" >> config.sh
echo "export GIT_PREFIX=${GIT_PREFIX}" >> config.sh
echo "export GIT_OWNERNAME=${GIT_OWNERNAME}" >> config.sh
echo "export GIT_PROJECT=${GIT_PROJECT}" >> config.sh
echo "export MY_DATA_FOLDER=${MY_DATA_FOLDER}" >> config.sh
chmod 755 config.sh
##################################
## down.sh (generate a script)
####################
echo "# Stop Docker" > down.sh
echo "source ./config.sh" >> down.sh
echo 'cd "${MY_BRANCH}/"' >> down.sh
echo 'cd "${GIT_PROJECT}/"' >> down.sh
echo "docker-compose down" >> down.sh
chmod 755 down.sh
##################################
## up.sh (generate a script)
####################
echo "# Start Docker" > up.sh
echo "source ./config.sh" >> up.sh
echo 'cd "${MY_BRANCH}/"' >> up.sh
echo 'cd "${GIT_PROJECT}/"' >> up.sh
echo "docker-compose build" >> up.sh
echo "# after build" >> up.sh
echo "docker-compose up" >> up.sh
chmod 755 up.sh
####################
# Stop if branch has already been down loaded
####################
if [ -d ${MY_BRANCH} ]; then
  echo "Already cloned. Stopping script."
  exit 0
fi
####################
# Setup Branch Folder
####################
echo "create folder...${MY_BRANCH}"
if [ ! -d ${MY_BRANCH}  ]; then
  # make the branch
  mkdir ${MY_BRANCH}/
fi
cd ${MY_BRANCH}/
####################
# Clone the Repo
####################
export GIT_REPOURL=https://github.com/${GIT_OWNERNAME}/${GIT_PROJECT}.git
echo "GIT_PROJECT is ${GIT_PROJECT} "
if [ ! -d ${GIT_PROJECT} ] ; then
   echo "# Clone ${GIT_REPOURL}"
   git clone ${GIT_REPOURL}
fi
####################
## Checkout the Branch
###################
cd ${GIT_PROJECT}/
echo "Checkout"
git checkout -b ${MY_BRANCH}
####################
## Create the branch on
###################
#git push origin ${MY_BRANCH}
git status


#### Environment variables are stored in the .env file. The .env is placed in the same folder as the docker-compose.yml.
#####################################
#### Generate an adopt-a-drain/.env
#####################################
# adopt-a-drain/.env

echo "# Google Map API (aad-web)" > .env
echo "GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}" >> .env

echo "# Data.World API (aad-web)" >> .env
echo "DW_AUTH_TOKEN=${DW_AUTH_TOKEN}" >> .env
echo "DW_USER=citizenlabs" >> .env
echo "DW_DRAIN_URL=https://api.data.world/v0/sql/citizenlabs/grb-storm-drains" >> .env

echo "# Adopt-a-Drain (aad-web)" >> .env
echo "AAD_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJDaXRpemVuLUxhYnMiLCJzdWIiOiJPcmlnaW4iLCJuYW1lIjoiQWRvcHQtYS1EcmFpbiIsInJvbGUiOiJndWVzdF9hYWQifQ.ML4Tmgv0jjwUzcqlxT3-Qcuk_vJpcgoXkni9IbdS4Wo" >> .env
echo "AAD_API_URL=http://localhost:3100/rpc" >> .env
echo "AAD_API_VERSION=aad_version_1_4_2" >> .env
echo "LB_GUEST_PASSWORD=mysecretclientpassword" >> .env
echo "LB_WODEN={"org":"CitizenLabs","app":"Adopt-A-Drain","name":"woden@citizenlabs.org","password":"a1A!aaaa"}" >> .env
echo "# Postgres (aad-db)" >> .env
echo "POSTGRES_DB=aad_db" >> .env
echo "POSTGRES_USER=postgres" >> .env
echo "POSTGRES_PASSWORD=mysecretdatabasepassword" >> .env
echo "POSTGRES_JWT_SECRET=PASSWORDmustBEATLEAST32CHARSLONGLONG" >> .env
echo "# Postgrest (aad-db)" >> .env
echo "PGRST_DB_SCHEMA=aad_version_1_4_2" >> .env
echo "PGRST_DB_ANON_ROLE=guest_aad" >> .env

echo "OK"
```

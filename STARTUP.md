# Get Started
Always create a branch for your development.

#### Prerequisites
This can be the hardest section for new developers and a challenge to seasoned veterans.
Keys and Tokens are never saved to the repo.
1. **[Install Docker](https://www.docker.com)**
1.  **[Google Map Key](https://developers.google.com/maps/documentation/javascript/get-api-key)**
    1. setup an account
    1. get a key
1. **[Data.World API Token](https://data.world)**
    1. setup an account
    1. get a token from the account page
1. **[AAD API Token](https://jwt.io)** (developers can use the token provided)
    1. header is {"alg": "HS256","typ": "JWT"}
    1. payload is {"iss": "CitizenLabs","sub": "Origin","name": "Adopt-a-Drain","role": "guest_aad"}
    1. verify signature password is PASSWORDmustBEATLEAST32CHARSLONGLONG
        1. password is configured in the .env as POSTGRES_JWT_SECRET

# Setup Folders

This is a the recommended setup, experienced git user may vary.
* [Manually Setup Folders and Files](#manually-setup-folders-and-files)


## Expected Folder Structure

```
+-- citizenlabsgr/
    |
    +-- <your-branch-name>/
        |
        +-- adopt-a-drain-nuxtjs
            |-- .env

```

## Manual Setup

1. Folders
    ```
    # Folders
    mkdir citizenlabsgr/
    cd citizenlabsgr/

    ```
1. Create a configuration file
Change the branch name in the git.config.sh file .

```
  # cd citizenlabsgr/
  echo 'export GIT_BRANCH=provide.a.branch.name' >  git.config.sh
  echo 'export GIT_PROJECT=adopt-a-drain-nuxtjs' >>  git.config.sh
  echo 'export GIT_PREFIX=aad' >>  git.config.sh
  echo 'export GIT_OWNERNAME=citizenlabsgr' >>  git.config.sh
  echo 'export GIT_TRUNK=main' >>  git.config.sh
```

1. Create a bash download script.

  ```
  # cd citizenlabsgr/

  echo 'source ./git.config.sh' > 'download.sh'

  echo 'if [ ! -f git.config.sh ]; then' >> 'download.sh'
  echo '  exit 1' >> 'download.sh'
  echo 'fi' >> 'download.sh'

  echo 'if [ ! -d ${GIT_BRANCH}  ]; then' >> 'download.sh'
  echo '  # make the branch' >> 'download.sh'
  echo '  mkdir ${GIT_BRANCH}/' >> 'download.sh'
  echo 'fi' >> 'download.sh'

  echo 'cd ${GIT_BRANCH}/' >> 'download.sh'

  echo '##############' >> 'download.sh'
  echo '# clone' >> 'download.sh'
  echo '##########' >> 'download.sh'

  echo 'export MY_REPOURL=https://github.com/${GIT_OWNERNAME}/${GIT_PROJECT}.git' >> 'download.sh'

  echo 'if [ ! -d ${GIT_PROJECT} ] ; then' >> 'download.sh'
  echo '   git clone ${MY_REPOURL}' >> 'download.sh'
  echo 'fi' >> 'download.sh'

  echo 'cd ${GIT_PROJECT}/' >> 'download.sh'
  echo 'git checkout -b ${GIT_BRANCH}' >> 'download.sh'
  # permission the download script
  chmod 755 download.sh

  ```
3. Run download
Before running the download script, change the branch name.

  ```
  # cd citizenlabsgr/
  ./download.sh
  ```

1. Create .env file in the adopt-a-drain-nuxtjs folder
    1. Cut and paste the following into .env
    ```
    # adopt-a-drain-nuxtjs/.env

    NODE_ENV=development

    ###############
    # Google Map API (aad-web)
    ############
    GOOGLE_MAPS_API_KEY=<your-google-map-api-key>

    ###########
    # Data.World API (aad-web)
    ##########
    DW_AUTH_TOKEN=<your-data.world-authorization-token>
    DW_USER=citizenlabs
    DW_DRAIN_URL=https://api.data.world/v0/sql/citizenlabs/lgrow-storm-drains-current

    ########
    # Adopt a Drain
    ########
    API_HOST=0.0.0.0
    API_PORT=5555
    AAD_API_URL=http://0.0.0.0:5555
    AAD_API_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaXRpemVubGFicy1hcGkiLCJpc3MiOiJjaXRpemVubGFicyIsInN1YiI6ImNsaWVudC1hcGkiLCJ1c2VyIjoiZ3Vlc3QiLCJzY29wZSI6ImFwaV9ndWVzdCIsImtleSI6IjAifQ.P3rZzJPzyCe6X96eyHSWOL_Yt6_c8ql2mwcioI8tkFU

    ############
    # Postgres specific variables
    ############
    POSTGRES_DB=aad_db
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=mysecretdatabasepassword
    # JWT_SECRET requires at least 32 characters
    POSTGRES_JWT_SECRET=fe5d9645_302a_493d_b9de_207dfa16ca9c
    POSTGRES_API_PASSWORD=mysecretdatabasepassword
    POSTGRES_JWT_CLAIMS={"aud":"citizenlabs-api", "iss":"citizenlabs", "sub":"client-api", "user":"guest", "scope":"api_guest", "key":"0"}

    ########
    # API
    ########
    # API_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaXRpemVubGFicy1hcGkiLCJpc3MiOiJjaXRpemVubGFicyIsInN1YiI6ImNsaWVudC1hcGkiLCJ1c2VyIjoiZ3Vlc3QiLCJzY29wZSI6ImFwaV9ndWVzdCIsImtleSI6IjAifQ.P3rZzJPzyCe6X96eyHSWOL_Yt6_c8ql2mwcioI8tkFU
    DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/aad_db
    JWT_SECRET=${POSTGRES_JWT_SECRET}
    JWT_CLAIMS=${POSTGRES_JWT_CLAIMS}
    # ACCEPTED_ORIGINS is a Security issue, ["*"]" can be used but not a good idea to let everyone connect
    #                  add a string list of acceptable urls like '["http://localhost:3000"]'
    #ACCEPTED_ORIGINS='["http://localhost:3000"]'
    ACCEPTED_ORIGINS='["*"]'
    # In dev, the HEROKU_API_KEY can be set to anything
    # In GitHub secrets, set HEROKU_API_KEY to actual value from heroku
    HEROKU_API_KEY=stub

    ```



### Start Docker
This will be slow the first time)

    ```
    # open a command window
    # from the adopt-a-drain-nuxtjs/ folder

    docker-compose build

    docker-compose up
    ```
### Stop Docker
    ```
    # open a command window
    # from the adopt-a-drain-nuxtjs/ folder

    docker-compose down
    ```
### Start Adopt A Drain
    ```
    # when docker is up and running
    open -a safari http://localhost:3000
    ```

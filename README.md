# Adopt a Drain (AAD)
Adopt a drain

## Why Change Adopt-a-Drain?
### Goals
| ID | Goal
| :------ | --------
| G1  | **Grow**, the AAD developer pool  |
| G2  | **Clarify**, the codebase  |
| G3  | **Simplify**, AAD's development and deployment  |
| G4  | **Decouple**, the application from the data and services  |

### Strategies   
| Strategy | Goal IDs
| :------ | --------
| Replace Ruby with Nuxtjs (nodejs) | G1, G2         
| Use Postgrest APIs to decoupled the application and data storage | G1, G2 |
| Replace the current application's user interface with a Single page design | G3,G4 |
| ~~Static Website, should run on github or aws S3~~  | G1,G3  |
| Establish Test Driven Development | G2 |

### Definitions
* **AAD** is Adopt-A-Drain
* **Abandon** is the process making an adoptee an orphan.  
* **Adopter** is an AAD registered user
* **Adoption** is the process adopting an orphan storm drain
* **Adoptee** is an adopted storm drain
* **Document** is a block of text, formatted with Markdown, and accessible to the application 
* **Orphan** is an unadopted storm drain

Document is a block of text, formatted with Markdown, and accessible to the application 

# Get Started
## Prerequisites
| Prerequisite | Token | Note
| :------ | -------- | --------
| **[Google map key](https://developers.google.com/maps/documentation/javascript/get-api-key)** | GOOGLE_MAPS_API_KEY | yes, they ask for a credit card but wont bill you. |
| **[Data.World API Token](https://data.world)**  | DW_AUTH_TOKEN | Look in Data.World's advanced settings.  |
| **[Docker](https://www.docker.com)** | N/A | Docker will get you up and going faster.  |
| **[AAD API Token(https://jwt.io)]**  | AAD_AUTH_TOKEN | use aad-payload, password is same as POSTGRES_JWT_SECRET  |

* aad-payload is {"iss": "Citizen-Labs","sub": "Origin","name": "Adopt-a-Drain","role": "guest_aad"}


### Environment Variables
Environment variables are stored in the .env file. The .env is placed in the same folder as the docker-compose.yml.
```
# adopt-a-drain/.env

# Google Map API (aad-web)
GOOGLE_MAPS_API_KEY=<get a key from google>

# Data.World API (aad-web)
DW_USER=citizenlabs
DW_AUTH_TOKEN=<get a personal token from data.world's advanced settings>
DW_DRAIN_URL=https://api.data.world/v0/sql/citizenlabs/grb-storm-drains

# Adopt-a-Drain (aad-web)
LB_GUEST_PASSWORD=<provide-guest-password-for-client>
LB_WODEN={"org":"CitizenLabs","app":"Adopt-A-Drain","name":"woden@citizenlabs.org","password":"a1A!aaaa"}
AAD_API_TOKEN=<sample-aad-api-token>
AAD_API_URL=http://localhost:3100/rpc
AAD_API_VERSION=aad_version_1_3_0

# Postgres (aad-db)
POSTGRES_DB=aad_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<provide-database-password>
POSTGRES_JWT_SECRET=<provde-32-char-password>

# Postgrest (aad-db)
PGRST_DB_SCHEMA=aad_version_1_3_0
PGRST_DB_ANON_ROLE=guest_aad
```
* \<sample-aad-api-token\> is eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJDaXRpemVuLUxhYnMiLCJzdWIiOiJPcmlnaW4iLCJuYW1lIjoiQWRvcHQtYS1EcmFpbiIsInJvbGUiOiJndWVzdF9hYWQifQ.ML4Tmgv0jjwUzcqlxT3-Qcuk_vJpcgoXkni9IbdS4Wo


### System Startup, Docker-Compose
```
# build the docker containers
cd adopt-a-drain/aad-web/
docker-comopose build

# after build
cd adopt-a-drain/
docker-compose up

# after development
docker-compose down

```
* Always use docker-compose down to avoid corrupting the Postgres database (aad_db).

### Tests
Tests are run automatically when docker-compose is run.
* aad-db: https://pgtap.org , run automatically when docker creates database  
* aad-web: https://jestjs.io, run manually from command line
### Run aad-web tests   
```
cd adopt-a-drain/
docker-compose run web npm run test
```

### Open Adopt-a-Drain
* open browser
* http://localhost:3000

### Tools
* Code Editor: Atom https://atom.io
* Python Editor: PyCharm https://www.jetbrains.com/pycharm/download/#section=mac
* SQL Client: Postico https://eggerapps.at/postico/
* Database: Postgres https://www.postgresql.org
* API: Postgrest http://postgrest.org/en/v7.0.0/


# Issues
We use three kinds of issues
1. __Stories__, Stories describe the need and wants of the business Owner and/or the Team Leader
2. __Things__, Things need to be designed, tested, and developed. 
3. __Actions__, Verbs describe actions to be taken. 
  
You should almost never need to write a story.  All things are logical constructs of stories, and all actions are the activities necessary to construct things.
  
Use __nouns__ to designate things and __verbs__ to designate actions.
Common nouns include: API, Component, Database, Process, Table
Common verbs include: Create, Change, Cleanup, Document, Delete, Integrate, Migrate, Update, Refactor, Remove, and Rename. 

## How to Name an Issue
 * __Review the Story issues__, Filter by story number, e.g., #45", to get list of a Story's issues  
* __Name Pattern__, #<story-number>.<title>
* __Story-number__, Filtering by "As a" will give a list of all story issues, find the story-number there.
* __Title__, start with verb or noun, followed by short description

# Understanding AAD
Some details

## Core Processes
| Process | Description |  Method |
| :------ | -------- | ------ |
| Signup            | Collect an adopter's personal identity information | adopter |
| Signin            | Authenticate an adopter with AAD | signin |
| Update Adopter    | Update an adopter's personal identity information | adopter |
| Adoption    | Adopt an orphaned drain | adoptee |
| Abandon     | Orphan a previously adopted drain | ???? |

## Helper Processes
| Process | Description |  Method |
| :------ | -------- | ------ |
| Send Adoption Email | Notify adopter of the adoption responsibilities | ???? |
| Send Reset Password Email | Notify adopter of request to change password | ???? |
| Reset Password    | Initiate the change of an adopter's password | ???? |


AAD API Generalization
```
                                    Map API (aka, Google Map API)
                                   /     Orphan API (Data World API)
                                  /    /     
Adopt-a-Drain <----> AAD API <--------------------------------
                                           \     \     \    \
                                            \     \     \    Document API
                                             \     \     Signin API
                                              \     Adoptee API
                                               Adopter API

```

### AAD API
The AAD API is a collection of APIs implemented in different ways.  To keep the writing simple, the API is treated as one implementation but know that the Google Maps, and Data.World APIs have their own way about them and you will have to become familiar with each if you want modify the API code.

| API | Implements | Endpoint
| --- | -------------- | ------
| **Map API**  | [Google Map API](https://developers.google.com/maps/documentation/javascript/tutorial)  |
| **Orphan API** | [Data.World API](https://apidocs.data.world)  | https://api.data.world/v0/sql/citizenlabs/grb-storm-drains
| **Adopter API** | [Postgrest](https://github.com/PostgREST/postgrest)  | rpc/adopter |
| **Adoptee API** | [Postgrest](https://github.com/PostgREST/postgrest)   | rpc/adoptee |
| **Signin API**  | [Postgrest](https://github.com/PostgREST/postgrest)   | rpc/credential |
| **Document** | |  
* development endpoint prefix: http://localhost:3100/

### Data
AAD has no direct access to the data storage system. APIs handle all the transactions.  Therefore, the storage implementation isn't locked into Postgres nor into a relational model.  

Again to keep the writing simple, data is framed in terms of forms and documents. A form is a collection of attributes which represent persons, places, things or ideas.


| Form  | Description | Columns |
| ----- | ------| ------- |
| **Adopter**  | Users capable of adoptions | id, key, name , type, password  |
| **Adoptee** | Adopted Orphan  | id, lat, lon, name, type, orphan_id, adopter_key" |
| **Orphan** | Unadopted drain | dr_asset_id, dr_discharge, dr_jurisdiction, dr_lat, dr_lon, dr_location, dr_owner, dr_subtype, dr_subwatershed, dr_type
| **Event** | Log of application activities | name, type, status
| **Document** | Application specific documents | id, document, current |


* id is a globally unique identifier (GUID) or a well known very unique identifier (e.g., email)
* key is a globally unique identifier (GUID)
* name is a name specfic to the form type, for example, an adopter name would be the username of the adopter
* type is the kind of form, adopter, adoptee, etc.
* password is an encrypted password
* lat is latitude
* lon is longitude
* orphan_id is an identifier referencing an orphan
* adopter_key is an identifier referencing an adopter
* status is an http status
* document is a block of Markdown text
* current is boolean value identifying a form as the most current with regards to type

### Endpoints

| Endpoint | Description | Returns  |  
| -------- | ------ | ------ |
| adopter  | Create an adopter (aka, Sign up) | status |
|          | Read adopter by id  | adopter |
|          | Update adopter  | status |
| adoptee  | Create an adoptee (aka, Adopt a drain) | status  |
|          | Read adoptee by id  | adoptee  |
|          | Delete or orphan a drain | status  |
| signin   | Create an Authorization Token | adopter-token |
| forgot   | Create a forgot password token  | status |
| document | Create a document | status |
|          | Read a document by id | document |
|          | Update a document | status  |
|          | Delete  | status  |

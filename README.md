# Adopt a Drain (AAD)
Adopt a drain

## Why Change AAD?
### Goals
| ID | Goal
| :------ | --------
| G1  | **Grow** the AAD developer pool  |
| G2  | **Clarify** the codebase  |
| G3  | **Simplify** AAD's development and deployment  |
| G4  | **Decouple** the application from the data and services  |

### Strategies   
| Strategy | Goal IDs
| :------ | --------
| Replace Ruby with Nuxtjs (nodejs) | G1, G2         
| Use Postgrest APIs to decoupled the application and data storage | G1, G2 |
| Replace the current application's user interface with a Single page design | G3,G4 |
| --Static Website, should run on github or aws S3--  | G1,G3  |

### Definitions
* **AAD** is Adopt-A-Drain
* **Abandon** is the process making an adoptee an orphan.  
* **Adopter** is an AAD registered user
* **Adoptee** is an adopted storm drain
* **Credential** is a user name and password or a service token
* **Document** is the result of merging a template with data
* **Orphan** is an unadopted storm drain
* **Template** is Markdown plain text embedded with data references.


# Get Started
## Prerequisites
| Prerequisite | Token | Note
| :------ | -------- | --------
| **[Google map key](https://developers.google.com/maps/documentation/javascript/get-api-key)** | GOOGLE_MAPS_API_KEY | yes, they ask for a credit card but wont bill you. |
| **[Data.World API Token](https://data.world)**  | DW_AUTH_TOKEN | Look in Data.World's advanced settings.  |
| **[Docker](https://www.docker.com)** | N/A | Docker will get you up and going faster.  |


### Environment Variables
Environment variables are stored in .env
```
# aad-web/.env

# Google Map API
GOOGLE_MAPS_API_KEY=<get a key from google>

# Data.World API
DW_USER=citizenlabs
DW_AUTH_TOKEN=<get a personal token from data.world's advanced settings>
DW_DRAIN_URL=https://api.data.world/v0/sql/citizenlabs/grb-storm-drains

```


### Docker Compose
```
# build once, fresh clones should be built
cd adopt-a-drain/aad-web/
docker-comopose build

# after build
cd adopt-a-drain/
docker-compose up

# after development
docker-compose down

```

### Tests
Tests are run automatically when docker-compose is run.
* aad-web: https://jestjs.io
* aad-db: https://pgtap.org

```
open command window
cd adopt-a-drain/aad-web/
npm run test
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


# Understanding AAD
Some technical details

## Processes
| Process | Description |  Method |
| :------ | -------- | ------ |
| Signup            | Collect an adopter's personal identity information | adopter |
| Signin            | Authenticate an adopter with AAD | signin |
| Update Adopter    | Update an adopter's personal identity information | adopter |
| Adoption    | Adopt an orphaned drain | adoptee |
| Send Adoption Email | Notify adopter of the adoption responsibilities | ???? |
| Abandon     | Orphan a previously adopted drain | ???? |
| Send Reset Password Email | Notify adopter of request to change password | ???? |
| Reset Password    | Initiate the change of an adopter's password | ???? |

## Architecture

API Generalization
```
API Mappings


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
| Read     | Read a document by id | document |
|          | Update a document | status  |
|          | Read | document by id | document |
|          | Delete  | status  |

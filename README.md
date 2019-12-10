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
| Static Website, should run on github or aws S3  | G1,G3  |

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
# adopt-a-drain-web/.env

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
cd adopt-a-drain/adopt-a-drain-web/
docker-comopose build

# after build
cd adopt-a-drain/
docker-compose up

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

# Understanding AAD
Some technical details
## Processes
| Process | Description |  
| :------ | -------- |
| Signup            | Collect an adopter's personal identity information |
| Signin            | Authenticate an adopter with AAD |
| Update Adopter    | Update an adopter's personal identity information|
| Adoption    | Adopt an orphaned drain |
| Send Adoption Email | Notify adopter of the adoption responsibilities |
| Abandon     | Orphan a previously adopted drain |
| Send Reset Password Email |  |
| Reset Password    | Initiate the change of an adopter's password |

## Architecture

API Mappings
```
API Mappings
                            Map API   AAD Credential API
                           /         /
AAD <----- AAD DEV API <----------------
                            \     \     \
                             \     \     Adoptee API
                              \     Adopter API
                                Orphan API

```

### AAD API
The AAD API is a collection of APIs implemented in different ways.  To keep the writing simple, the API is treated as one implementation but know that the Google Maps, and Data.World APIs have their own way about them and you will have to become familiar with each if you want modify the API code.

| API | Implements | Endpoint
| --- | -------------- | ------
| **Map API**  | [Google Map API](https://developers.google.com/maps/documentation/javascript/tutorial)  |
| **Orphan API** | [Data.World API](https://apidocs.data.world)  | https://api.data.world/v0/sql/citizenlabs/grb-storm-drains
| **Adopter API** | [Postgrest](https://github.com/PostgREST/postgrest)  | rpc/adopter
| **Adoptee API** | [Postgrest](https://github.com/PostgREST/postgrest)   | rpc/adoptee
| **AAD Credential API**  | [Postgrest](https://github.com/PostgREST/postgrest)   | rpc/credential

* development endpoint prefix: http://localhost:3100/

### Data
AAD has no direct access to the data storage system. APIs handle all the transactions.  Therefore, the storage implementation isn't locked into Postgres nor into a relational model.  

| Table | Description | Columns |
| ----- | ------| ------- |
| **Adopters**  | Users capable of adoptions | usr_id, usr_first, usr_last, usr_email, usr_role, usr_password, usr_active, usr_created, usr_last_changed  |
| **Adoptees** | Adopted Orphans  | adpt_id, adptrid, adpt_name, adpt_active, adpt_created, adpt_last_changed
| **Orphans** | Unadopted drains | dr_asset_id, dr_discharge, dr_jurisdiction, dr_lat, dr_lon, dr_location, dr_owner, dr_subtype, dr_subwatershed, dr_type
| **History** | Log of application activities | log_id, log_useid, log_process, log_table, log_tableid, log_action, log_value, log_date
| **Documents** | Application specific documents | doc_id, doc_instance, doc_created
| **Templates** | Markdown formatted templates | tmpl_id, tmpl_object, tmpl_created, tmpl_last_changed |


### Endpoints


| Endpoint | Description | Table  | Request Data   
| -------- | ------ | ------ | ------
| adopter  | Sign up an adopter | adopters |
|          | Update an adopter's info  | adopters |
| adoptee  | Adopt a drain | adoptees  |
|          | Orphan a drain | adoptees  |
| credentials | Sign in an adopter | adopters |
|             | Reset Password | adopters |
| document    | Combine template with data | documents |
| template   | Markdown text with imbedded API references  |   |

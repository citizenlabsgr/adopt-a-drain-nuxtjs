# Adopt a Drain (AAD)

We prefer to use the word "trunk" rather than "master." Trunk better fits the tree metaphor used to descibe the repository.

hi 2

## Why Change Adopt-a-Drain?
The original Adopt a Drain idea, design and code is the product of the San Francisco Brigade of Code for America.
Citizen Labs has taken the idea, simplified the code, and reworked the architecture to appeal to a broader group of developers.


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

## Contribution Process
1. **Find an Issue**: Review the repo's issues (Stories, Things, and Actions)
1. **Clone**: Get copy of the code
1. **Branch**: Isolate the production code from your new features/development code
1. **Develop**: Make your contribution (write tests, write code, repeat)
    1. Write tests
    1. Write code
    1. Repeat
1. **Document**: Update the documentation to describe your contribution
1. **Pull Push**: Merge changes from trunk/others into your branch (Pull), and then merge your contributions back to your branch on GitHub
1. **Pull Request**: Notifiy the repo owner that your contribution is ready for review
1. **Review**: one or more contributor's will review, suggest changes, and/or approve.

# Developer Setup
1. Complete the [Prerequisites](#prerequisites)
1. [Get started](STARTUP.md)

## Prerequisites
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
    1. payload is {"iss": "Citizen-Labs","sub": "Origin","name": "Adopt-a-Drain","role": "guest_aad"}
    1. verify signature password is PASSWORDmustBEATLEAST32CHARSLONGLONG
        1. password is configured in the .env as POSTGRES_JWT_SECRET

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
* Docker: https://www.docker.com
* Python Editor: PyCharm https://www.jetbrains.com/pycharm/download/#section=mac
* SQL Client: Postico https://eggerapps.at/postico/
* Database: Postgres https://www.postgresql.org
* API: Postgrest http://postgrest.org/en/v7.0.0/

# Issues
We use three kinds of issues Stories, Things, and Actions.
## Stories
You should almost never need to write a story.
1. __Stories__ describe the needs and wants of the business Owner and/or the Team Leader
1. Name Pattern: As a \<stakeholder>, I need <general-description>, so I can <reason>.
1. Common Stakeholders: developer, process owner, team leader
1. Get a  [Story List](https://github.com/Wilfongjt/adopt-a-drain/issues?q=As+a) by filtering issues with "As a"

## Things
All things are logical constructs of Stories. You can't have a thing that doesn't relate to a Story.
1. __Things__, Things need to be designed, tested, and developed.
1. Name Pattern: #<story-number>.\<noun>:\<description>
1. Common nouns include: API, Component, Database, Process, Table
1. Thing titles always start with a "#" followed by story number (aka, issue number), followed by a noun
1. Get a list of Things by filtering issues with # followed by a story number.
    1. e.g., #45, list all things and actions associated with Story #45

## Actions
Actions are the activities necessary to construct things
1. __Actions__ are verbs describing activity to be taken.
1. Name Pattern: #<story-number>.\<verb>.\<description>
1. Common verbs include: Create, Change, Cleanup, Document, Delete, Integrate, Migrate, Update, Refactor, Remove, and Rename.
1. Get a list of Actions by filtering issues with # followed by a story number.
    1. e.g., #45, list all things and action associated with Story #45

# Understanding AAD
Some details

### Definitions
* **AAD** is Adopt-A-Drain
* **Abandon** is the process making an adoptee an orphan.  
* **Adopter** is an AAD registered user
* **Adoption** is the process adopting an orphan storm drain
* **Adoptee** is an adopted storm drain
* **Document** is a block of text, formatted with Markdown, and accessible to the application
* **Orphan** is an unadopted storm drain
* **API-EP** is the Application Programming Interface EndPoint

Document is a block of text, formatted with Markdown, and accessible to the application
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
Adopt-a-Drain <----> AAD API <------------------------------------
                                           \     \     \     \    \
                                            \     \     \     \    Document API-EP
                                             \     \     \     Signin API-EP
                                              \     \     Adoptees API-EP
                                               \     Adoptee API-EP
                                                Adopter API-EP

```

### AAD API
The AAD API is a collection of APIs implemented in different ways.  To keep the writing simple, the API is treated as one implementation but know that the Google Maps, and Data.World APIs have their own way about them and you will have to become familiar with each if you want modify the API code.

| API | Implements | Endpoint
| --- | -------------- | ------
| **Map API**  | [Google Map API](https://developers.google.com/maps/documentation/javascript/tutorial)  |
| **Orphan API** | [Data.World API](https://apidocs.data.world)  | https://api.data.world/v0/sql/citizenlabs/grb-storm-drains
| **Adopter API** | [Postgrest](https://github.com/PostgREST/postgrest)  | rpc/adopter |
| **Adoptee API** | [Postgrest](https://github.com/PostgREST/postgrest)   | rpc/adoptee |
| **Adoptees API** | [Postgrest](https://github.com/PostgREST/postgrest)   | rpc/adoptees |
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
| adoptees  | Read adoptees | adoptee  |
| signin   | Create an Authorization Token | adopter-token |
| forgot   | Create a forgot password token  | status |
| document | Create a document | status |
|          | Read a document by id | document |
|          | Update a document | status  |
|          | Delete  | status  |

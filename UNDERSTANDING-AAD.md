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
| Orphan     | Orphan a previously adopted drain | ???? |

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
[Adoption[Expiration]] 
[Nav [Expiration,SignInMixin]]
[ModalSignIn]
[ModalSignOut]
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

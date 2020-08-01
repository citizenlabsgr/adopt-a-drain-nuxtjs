# Changes


| file | type | detail |
| ---- | ------- | ------ |
| 05.aad.1.1.1.sql | TODO 1.1.1 | Develop Strategy to signin under a new name without changing the ID |
| 05.aad.1.1.1.sql | DONE 1.1.1 | Add "org" to LB_WODEN in enviroment variables (.env). LB_WODEN={"org":"CitizenLabs","name":"woden@citizenlabs.org","password":"a1A!aaaa"} |
| 05.aad.1.1.1.sql | DONE 1.1.1 | Add "app" to LB_WODEN in enviroment variables (.env). LB_WODEN={"app":"Adopt-A-Drain","org":"CitizenLabs","name":"woden@citizenlabs.org","password":"a1A!aaaa"} |
| 05.aad.1.1.1.sql | DONE 1.1.1 | signin converts user name to lowercase |
| 05.aad.1.1.1.sql | DONE 1.1.1 | Id made from Email address stored as lowercase (adopt_a_drain_upsert_trigger_func) |
| 05.aad.1.1.1.sql | DONE 1.1.1 | adopter-token payload is now {"iss" | "Citizen-Labs","sub" | "Origin","name" | "Adopt-a-Drain","role" | "guest_aad"} |
| 05.aad.1.1.1.sql | DONE 1.1.1 | adopter-token expires in 5 minutes |
# Script Pattern


| file | type | detail |
| ---- | ------- | ------ |
| 00.aad.sql | ISSUES | Common Issues and Solutions |
| 00.aad.sql | Environment | Read environment variables |
| 00.aad.sql | DATABASE | Drop Database |
| 00.aad.sql | DATABASE | Create Database |
| 00.aad.sql | DATABASE | Create Extensions |
| 00.aad.sql | ROLE | Create Roles |
| 04.aad.1.1.0.sql | SCHEMA | Create Schema |
| 04.aad.1.1.0.sql | DATABASE | Alter app.settings |
| 04.aad.1.1.0.sql | GRANT | Grant Schema Permissions |
| 04.aad.1.1.0.sql | SCHEMA | Set Schema Path |
| 04.aad.1.1.0.sql | TYPE | Create Types |
| 04.aad.1.1.0.sql | TABLE | Create Table |
| 04.aad.1.1.0.sql | INDEX | Create Index |
| 04.aad.1.1.0.sql | GRANT | Grant Table Permissions |
| 04.aad.1.1.0.sql | FUNCTION | Table Trigger |
| 04.aad.1.1.0.sql | GRANT | Grant Execute |
| 04.aad.1.1.0.sql | TRIGGER | Create Table Trigger |
| 04.aad.1.1.0.sql | FUNCTION | Create process_logger(_form JSONB) |
| 04.aad.1.1.0.sql | GRANT | Grant Execute |
| 04.aad.1.1.0.sql | FUNCTION | Create process_logger_validate(form JSONB) |
| 04.aad.1.1.0.sql | GRANT | Grant Execute |
| 04.aad.1.1.0.sql | GRANT | GRANT Schema permissions |
| 04.aad.1.1.0.sql | GRANT | Grant Table permissions to process_logger_role |
| 04.aad.1.1.0.sql | GRANT | Grant Trigger Permissions to process_logger_role |
| 04.aad.1.1.0.sql | FUNCTION | Create http_response(_status text, _msg text) |
| 04.aad.1.1.0.sql | GRANT | Grant Function Permissions |
| 04.aad.1.1.0.sql | FUNCTION | Create is_valid_token(_token TEXT, expected_role TEXT) |
| 04.aad.1.1.0.sql | GRANT | Grant Function Permissions |
| 04.aad.1.1.0.sql | USER | Setup woden user |
| 04.aad.1.1.0.sql | FUNCTION | Create app_validate(form JSONB) |
| 04.aad.1.1.0.sql | GRANT | Grant Execute |
| 04.aad.1.1.0.sql | FUNCTION | Create app(form JSON) |
| 04.aad.1.1.0.sql | GRANT | Grant Execute |
| 04.aad.1.1.0.sql | FUNCTION | Create app(id TEXT) |
| 04.aad.1.1.0.sql | GRANT | Grant Execute |
| 04.aad.1.1.0.sql | GRANT | Grant authenticator more permissions |
| 04.aad.1.1.0.sql | FUNCTION | Create owner(form JSON) |
| 04.aad.1.1.0.sql | GRANT | Grant Execute |
| 04.aad.1.1.0.sql | FUNCTION | Create owner_validate(form JSONB) |
| 04.aad.1.1.0.sql | GRANT | Grant Execute |
| 04.aad.1.1.0.sql | FUNCTION | Create owner(id TEXT) |
| 04.aad.1.1.0.sql | GRANT | Grant Execute |
| 04.aad.1.1.0.sql | FUNCTION | Create signin_validate(form JSONB) |
| 04.aad.1.1.0.sql | GRANT | Grant Execute |
| 04.aad.1.1.0.sql | FUNCTION | Create aad_schema_1_1_0.signin(form JSON) |
| 04.aad.1.1.0.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | SCHEMA | Create Schema |
| 05.aad.1.1.1.sql | DATABASE | Alter app.settings |
| 05.aad.1.1.1.sql | GRANT | Grant Schema Permissions |
| 05.aad.1.1.1.sql | SCHEMA | Set Schema Path |
| 05.aad.1.1.1.sql | TYPE | Create Types |
| 05.aad.1.1.1.sql | TABLE | Create Table |
| 05.aad.1.1.1.sql | INDEX | Create Index |
| 05.aad.1.1.1.sql | GRANT | Grant Table Permissions |
| 05.aad.1.1.1.sql | FUNCTION | Table Trigger |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | TRIGGER | Create Table Trigger |
| 05.aad.1.1.1.sql | FUNCTION | Create process_logger(_form JSONB) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | FUNCTION | Create process_logger_validate(form JSONB) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | GRANT | GRANT Schema permissions |
| 05.aad.1.1.1.sql | GRANT | Grant Table permissions to process_logger_role |
| 05.aad.1.1.1.sql | GRANT | Grant Trigger Permissions to process_logger_role |
| 05.aad.1.1.1.sql | FUNCTION | Create http_response(_status text, _msg text) |
| 05.aad.1.1.1.sql | GRANT | Grant Function Permissions |
| 05.aad.1.1.1.sql | FUNCTION | Create is_valid_token(_token TEXT, expected_role TEXT) |
| 05.aad.1.1.1.sql | GRANT | Grant Function Permissions |
| 05.aad.1.1.1.sql | USER | Setup woden user |
| 05.aad.1.1.1.sql | FUNCTION | Create app_validate(form JSONB) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | FUNCTION | Create app(form JSON) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | FUNCTION | Create app(id TEXT) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | GRANT | Grant authenticator more permissions |
| 05.aad.1.1.1.sql | FUNCTION | Create owner(form JSON) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | FUNCTION | Create owner_validate(form JSONB) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | FUNCTION | Create owner(id TEXT) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | FUNCTION | Create signin_validate(form JSONB) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | FUNCTION | Create aad_schema_1_1_1.signin(form JSON) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | FUNCTION | Create adopter(form JSON) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | FUNCTION | Create adopter_validate(form JSONB) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | FUNCTION | Create adopter(id TEXT) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 90.aad.1.1.0.tests.sql | TEST | Test app Insert |
| 90.aad.1.1.0.tests.sql | TEST | Test app Select |
| 90.aad.1.1.0.tests.sql | TEST | Test owner Insert |
| 90.aad.1.1.0.tests.sql | TEST | Test process_logger Insert |
| 90.aad.1.1.0.tests.sql | TEST | Test(a) owner Insert |
| 90.aad.1.1.0.tests.sql | TEST | Test(b) signin Insert |
| 90.aad.1.1.1.tests.sql | TEST | Test app Insert |
| 90.aad.1.1.1.tests.sql | TEST | Test app Select |
| 90.aad.1.1.1.tests.sql | TEST | Test owner Insert |
| 90.aad.1.1.1.tests.sql | TEST | Test process_logger Insert |
| 90.aad.1.1.1.tests.sql | TEST | Test(a) owner Insert |
| 90.aad.1.1.1.tests.sql | TEST | Test(b) signin Insert |
| 90.aad.1.1.1.tests.sql | TEST | Test adopter Insert |
# Functions


| file | version | name | returns |
| ---- | ------- | ------- | ------ |
| 04.aad.1.1.0.sql |  aad_schema_1_1_0 | adopt_a_drain_upsert_trigger_func()  |  TRIGGER |
| 04.aad.1.1.0.sql |  aad_schema_1_1_0 | process_logger(_form JSONB)  |  JSONB |
| 04.aad.1.1.0.sql |  aad_schema_1_1_0 | process_logger_validate(form JSONB)  |  JSONB |
| 04.aad.1.1.0.sql |  aad_schema_1_1_0 | http_response(_status text, _msg text)  |  JSON |
| 04.aad.1.1.0.sql |  aad_schema_1_1_0 | is_valid_token(_token TEXT, expected_role TEXT)  |  Boolean |
| 04.aad.1.1.0.sql |  aad_schema_1_1_0 | app_validate(form JSONB)  |  JSONB |
| 04.aad.1.1.0.sql |  aad_schema_1_1_0 | app(form JSON)  |  JSONB |
| 04.aad.1.1.0.sql |  aad_schema_1_1_0 | app(id TEXT)  |  JSONB |
| 04.aad.1.1.0.sql |  aad_schema_1_1_0 | owner(form JSON)  |  JSONB |
| 04.aad.1.1.0.sql |  aad_schema_1_1_0 | owner_validate(form JSONB)  |  JSONB |
| 04.aad.1.1.0.sql |  aad_schema_1_1_0 | owner(id TEXT)  |  JSONB |
| 04.aad.1.1.0.sql |  aad_schema_1_1_0 | signin_validate(form JSONB)  |  JSONB |
| 04.aad.1.1.0.sql |  aad_schema_1_1_0 | signin(form JSON)  |  JSON |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | adopt_a_drain_upsert_trigger_func()  |  TRIGGER |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | process_logger(_form JSONB)  |  JSONB |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | process_logger_validate(form JSONB)  |  JSONB |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | http_response(_status text, _msg text)  |  JSON |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | is_valid_token(_token TEXT, expected_role TEXT)  |  Boolean |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | app_validate(form JSONB)  |  JSONB |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | app(form JSON)  |  JSONB |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | app(id TEXT)  |  JSONB |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | owner(form JSON)  |  JSONB |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | owner_validate(form JSONB)  |  JSONB |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | owner(id TEXT)  |  JSONB |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | signin_validate(form JSONB)  |  JSONB |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | signin(form JSON)  |  JSON |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | adopter(form JSON)  |  JSONB |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | adopter_validate(form JSONB)  |  JSONB |
| 05.aad.1.1.1.sql |  aad_schema_1_1_1 | adopter(id TEXT)  |  JSONB |

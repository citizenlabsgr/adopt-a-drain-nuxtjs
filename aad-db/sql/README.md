# 00.aad.sql


## Changes


| status | version | detail |
| ------ | ------- | ------ |
| Done | 0.0.0 | Setup environment variables |
| Done | 0.0.0 | Create Database |
| Done | 0.0.0 | Create Extensions |
| Done | 0.0.0 | Create Roles |


## Functions


| version | name | returns |
| ------- | ------- | ------ |


## Script Pattern


| file | type | detail |
| ---- | ------- | ------ |
| 00.aad.sql | ISSUES | Common Issues and Solutions |
| 00.aad.sql | Environment | Read environment variables |
| 00.aad.sql | DATABASE | Drop Database |
| 00.aad.sql | DATABASE | Create Database |
| 00.aad.sql | DATABASE | Create Extensions |
| 00.aad.sql | ROLE | Create Roles |
| 00.aad.sql | GRANT | Grant authenticator more permissions |


## Permissions


| file | action | permission | on | to |
| ---- | ------ | ---------- | ---- | ---- |
| 00.aad.sql | grant | guest_aad | authenticator |
| 00.aad.sql | grant | editor_aad | authenticator |
# 01.aad.sql


## Changes


| status | version | detail |
| ------ | ------- | ------ |
| Done | 1.2.1 | changed reg_id to reg_pk |
| Done | 1.2.1 | Change "process" type to "event" type |
| Done | 1.2.1 | Change Process_logger to event_logger |
| Done | 1.2.1 | Change 1_2_0 to 1_2_1 |
| Done | 1.2.1 | Dont allow drain to be adopted more than once ... uses index |
| Done | 1.2.0 | Add Adpotee |
| Done | 1.2.0 | Rename schema from aad_schema_1_2_1 to aad_version_1_2_1 |


## Functions


| version | name | returns |
| ------- | ------- | ------ |
|  aad_base | adopt_a_drain_upsert_trigger_func()  |  TRIGGER |
|  aad_base | adopt_a_drain_upsert_trigger_func()  |  TRIGGER |
|  aad_base | event_logger(form JSONB)  |  JSONB |
|  aad_base | event_logger_validate(form JSONB)  |  JSONB |
|  aad_base | http_response(_status text, _msg text)  |  JSON |
|  aad_base | is_valid_token(_token TEXT, expected_role TEXT)  |  Boolean |


## Script Pattern


| file | type | detail |
| ---- | ------- | ------ |
| 01.aad.sql | SCHEMA | Create Schema |
| 01.aad.sql | TABLE | Create Table |
| 01.aad.sql | INDEX | Create Index |
| 01.aad.sql | GRANT | Grant Table Permissions |
| 01.aad.sql | FUNCTION | Table Trigger |
| 01.aad.sql | GRANT | Grant Execute |
| 01.aad.sql | TRIGGER | Create Table Trigger |
| 01.aad.sql | USER | Setup woden user |
| 01.aad.sql | FUNCTION | Create event_logger(_form JSONB) |
| 01.aad.sql | GRANT | Grant Execute |
| 01.aad.sql | FUNCTION | Create event_logger_validate(form JSONB) |
| 01.aad.sql | GRANT | Grant Execute |
| 01.aad.sql | GRANT | GRANT Schema permissions |
| 01.aad.sql | GRANT | Grant Table permissions to event_logger_role |
| 01.aad.sql | GRANT | Grant Trigger Permissions to event_logger_role |
| 01.aad.sql | FUNCTION | Create http_response(_status text, _msg text) |
| 01.aad.sql | GRANT | Grant Function Permissions |
| 01.aad.sql | FUNCTION | Create is_valid_token(_token TEXT, expected_role TEXT) |
| 01.aad.sql | GRANT | Grant Function Permissions |


## Permissions


| file | action | permission | on | to |
| ---- | ------ | ---------- | ---- | ---- |
| 01.aad.sql | grant | insert | aad_base.adopt_a_drain  | guest_aad -- C |
| 01.aad.sql | grant | select | aad_base.adopt_a_drain  | guest_aad -- R, signin |
| 01.aad.sql | grant | insert | aad_base.adopt_a_drain  | editor_aad -- C |
| 01.aad.sql | grant | update | aad_base.adopt_a_drain  | editor_aad -- U |
| 01.aad.sql | grant | select | aad_base.adopt_a_drain  | editor_aad -- R |
| 01.aad.sql | grant | insert | aad_base.adopt_a_drain  | event_logger_role -- C |
| 01.aad.sql | grant | EXECUTE | FUNCTION aad_base.adopt_a_drain_upsert_trigger_func  | guest_aad |
| 01.aad.sql | grant | EXECUTE | FUNCTION aad_base.adopt_a_drain_upsert_trigger_func  | editor_aad |
| 01.aad.sql | grant | TRIGGER | aad_base.adopt_a_drain  | guest_aad |
| 01.aad.sql | grant | TRIGGER | aad_base.adopt_a_drain  | editor_aad |
| 01.aad.sql | grant | EXECUTE | FUNCTION aad_base.event_logger(JSONB) | event_logger_role -- upsert |
| 01.aad.sql | grant | EXECUTE | FUNCTION aad_base.event_logger_validate(JSONB) | event_logger_role -- upsert |
| 01.aad.sql | grant | insert | aad_base.adopt_a_drain  | event_logger_role -- C ... 'app' only |
| 01.aad.sql | grant | select | aad_base.adopt_a_drain  | event_logger_role -- R ... 'owner', 'app' |
| 01.aad.sql | grant | EXECUTE | FUNCTION aad_base.adopt_a_drain_upsert_trigger_func  | event_logger_role |
| 01.aad.sql | grant | EXECUTE | FUNCTION aad_base.http_response(TEXT, TEXT) | guest_aad -- C |
| 01.aad.sql | grant | EXECUTE | FUNCTION aad_base.http_response(TEXT, TEXT) | editor_aad -- C |
| 01.aad.sql | grant | EXECUTE | FUNCTION aad_base.is_valid_token(TEXT, TEXT) | guest_aad -- C |
| 01.aad.sql | grant | EXECUTE | FUNCTION aad_base.is_valid_token(TEXT, TEXT) | editor_aad -- C |
# 04.aad.1.1.0.sql


## Changes


| status | version | detail |
| ------ | ------- | ------ |
| Done | 1.1.0 | Create Table (adoopt_a_drain) |
| Done | 1.1.0 | Create Token types |
| Done | 1.1.0 | Design and develope table trigger |
| Done | 1.1.0 | Design and develope logging functions |
| Done | 1.1.0 | Design and develope a responce formatting function |
| Done | 1.1.0 | Design and develope a test for a valid token |
| Done | 1.1.0 | add an application administrator |
| Done | 1.1.0 | Design and develope an application identity |
| Done | 1.1.0 | Design and develope an applcation owner user |
| Done | 1.1.0 | Design and develope a login |


## Functions


| version | name | returns |
| ------- | ------- | ------ |
|  aad_schema_1_1_0 | adopt_a_drain_upsert_trigger_func()  |  TRIGGER |
|  aad_schema_1_1_0 | process_logger(_form JSONB)  |  JSONB |
|  aad_schema_1_1_0 | process_logger_validate(form JSONB)  |  JSONB |
|  aad_schema_1_1_0 | http_response(_status text, _msg text)  |  JSON |
|  aad_schema_1_1_0 | is_valid_token(_token TEXT, expected_role TEXT)  |  Boolean |
|  aad_schema_1_1_0 | app_validate(form JSONB)  |  JSONB |
|  aad_schema_1_1_0 | app(form JSON)  |  JSONB |
|  aad_schema_1_1_0 | app(id TEXT)  |  JSONB |
|  aad_schema_1_1_0 | owner(form JSON)  |  JSONB |
|  aad_schema_1_1_0 | owner_validate(form JSONB)  |  JSONB |
|  aad_schema_1_1_0 | owner(id TEXT)  |  JSONB |
|  aad_schema_1_1_0 | signin_validate(form JSONB)  |  JSONB |
|  aad_schema_1_1_0 | signin(form JSON)  |  JSON |


## Script Pattern


| file | type | detail |
| ---- | ------- | ------ |
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


## Permissions


| file | action | permission | on | to |
| ---- | ------ | ---------- | ---- | ---- |
| 04.aad.1.1.0.sql | grant | usage | schema aad_schema_1_1_0 | guest_aad |
| 04.aad.1.1.0.sql | grant | usage | schema aad_schema_1_1_0 | editor_aad |
| 04.aad.1.1.0.sql | grant | usage | schema aad_schema_1_1_0 | process_logger_role |
| 04.aad.1.1.0.sql | grant | insert | aad_schema_1_1_0.adopt_a_drain | guest_aad -- C |
| 04.aad.1.1.0.sql | grant | select | aad_schema_1_1_0.adopt_a_drain | guest_aad -- R, signin |
| 04.aad.1.1.0.sql | grant | insert | aad_schema_1_1_0.adopt_a_drain | editor_aad -- C |
| 04.aad.1.1.0.sql | grant | update | aad_schema_1_1_0.adopt_a_drain | editor_aad -- U |
| 04.aad.1.1.0.sql | grant | select | aad_schema_1_1_0.adopt_a_drain | editor_aad -- R |
| 04.aad.1.1.0.sql | grant | insert | aad_schema_1_1_0.adopt_a_drain | process_logger_role -- C |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.adopt_a_drain_upsert_trigger_func | guest_aad |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.adopt_a_drain_upsert_trigger_func | editor_aad |
| 04.aad.1.1.0.sql | grant | TRIGGER | aad_schema_1_1_0.adopt_a_drain | guest_aad |
| 04.aad.1.1.0.sql | grant | TRIGGER | aad_schema_1_1_0.adopt_a_drain | editor_aad |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.process_logger(JSONB) | process_logger_role -- upsert |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.process_logger_validate(JSONB) | process_logger_role -- upsert |
| 04.aad.1.1.0.sql | grant | usage | schema aad_schema_1_1_0 | process_logger_role |
| 04.aad.1.1.0.sql | grant | insert | aad_schema_1_1_0.adopt_a_drain | process_logger_role -- C ... 'app' only |
| 04.aad.1.1.0.sql | grant | select | aad_schema_1_1_0.adopt_a_drain | process_logger_role -- R ... 'owner', 'app' |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.adopt_a_drain_upsert_trigger_func | process_logger_role |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.http_response(TEXT, TEXT) | guest_aad -- C |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.http_response(TEXT, TEXT) | editor_aad -- C |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.is_valid_token(TEXT, TEXT) | guest_aad -- C |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.is_valid_token(TEXT, TEXT) | editor_aad -- C |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.app_validate(JSONB) | editor_aad |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.app(JSON) | editor_aad -- C |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.app(TEXT) | editor_aad -- C |
| 04.aad.1.1.0.sql | grant | guest_aad | authenticator |
| 04.aad.1.1.0.sql | grant | editor_aad | authenticator |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.owner(JSON) | guest_aad -- upsert |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.owner(JSON) | editor_aad -- upsert |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.owner_validate(JSONB) | guest_aad -- upsert |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.owner_validate(JSONB) | editor_aad -- upsert |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.owner(JSON) | editor_aad -- select |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.signin_validate(JSONB) | guest_aad -- upsert |
| 04.aad.1.1.0.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_0.signin(JSON) | guest_aad -- upsert |
# 05.aad.1.1.1.sql


## Changes


| status | version | detail |
| ------ | ------- | ------ |
| __PAUSE__ | 1.1.1 | When adopter is deactivated then deactivate all adoptions by that adopter |
| __PAUSE__ | 1.1.1 | test for active adopter record during signin. When active is false then adopter is the same as deleted. |
| Done | 1.1.1 | on signin, put id (jti) and form.key (key) into token. {"iss" | "CitizenLabs","sub" | "Adopt-A-Drain","jti" | "johndoe@citizenlabs.org","key" | "55900b9c-385c-46e8-9403-d7b57b6eb149","role" | "editor_aad","exp" | 1596403055} |
| Done | 1.1.1 | Add {id:} to adopter form |
| Done | 1.1.1 | Change adopter {id | } to {key:} in trigger... less confusing |
| Done | 1.1.1 | Add active to adopter, default is TRUE.... active already in main record |
| Done | 1.1.1 | Develop Strategy to signin under a new name without changing the ID |
| Done | 1.1.1 | Add index for user name search ... CREATE INDEX adopter_idx ON aad_schema_1_1_1.adopt_a_drain USING gin (reg_form) where reg_type = 'adopter'; |
| Done | 1.1.1 | Add "org" to LB_WODEN in enviroment variables (.env). LB_WODEN={"org":"CitizenLabs","name":"woden@citizenlabs.org","password":"a1A!aaaa"} |
| Done | 1.1.1 | Add "app" to LB_WODEN in enviroment variables (.env). LB_WODEN={"app":"Adopt-A-Drain","org":"CitizenLabs","name":"woden@citizenlabs.org","password":"a1A!aaaa"} |
| Done | 1.1.1 | signin converts user name to lowercase |
| Done | 1.1.1 | Id made from Email address stored as lowercase (adopt_a_drain_upsert_trigger_func) |
| Done | 1.1.1 | adopter-token payload is now {"iss" | "CitizenLabs","sub" | "Origin","name" | "Adopt-a-Drain","role" | "guest_aad"} |
| Done | 1.1.1 | adopter-token expires in 5 minutes |


## Functions


| version | name | returns |
| ------- | ------- | ------ |
|  aad_schema_1_1_1 | adopt_a_drain_upsert_trigger_func()  |  TRIGGER |
|  aad_schema_1_1_1 | process_logger(_form JSONB)  |  JSONB |
|  aad_schema_1_1_1 | process_logger_validate(form JSONB)  |  JSONB |
|  aad_schema_1_1_1 | http_response(_status text, _msg text)  |  JSON |
|  aad_schema_1_1_1 | is_valid_token(_token TEXT, expected_role TEXT)  |  Boolean |
|  aad_schema_1_1_1 | app_validate(form JSONB)  |  JSONB |
|  aad_schema_1_1_1 | app(form JSON)  |  JSONB |
|  aad_schema_1_1_1 | app(id TEXT)  |  JSONB |
|  aad_schema_1_1_1 | signin_validate(form JSONB)  |  JSONB |
|  aad_schema_1_1_1 | signin(form JSON)  |  JSONB |
|  aad_schema_1_1_1 | adopter(form JSON)  |  JSONB |
|  aad_schema_1_1_1 | adopter_validate(form JSONB)  |  JSONB |
|  aad_schema_1_1_1 | adopter(id TEXT)  |  JSONB |


## Script Pattern


| file | type | detail |
| ---- | ------- | ------ |
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
| 05.aad.1.1.1.sql | FUNCTION | Create signin_validate(form JSONB) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | FUNCTION | Create aad_schema_1_1_1.signin(form JSON) |
| 05.aad.1.1.1.sql | $$ LANGUAGE plpgsql;GRANT | Grant Execute |
| 05.aad.1.1.1.sql | FUNCTION | Create adopter(form JSON) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | FUNCTION | Create adopter_validate(form JSONB) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |
| 05.aad.1.1.1.sql | FUNCTION | Create adopter(id TEXT) |
| 05.aad.1.1.1.sql | GRANT | Grant Execute |


## Permissions


| file | action | permission | on | to |
| ---- | ------ | ---------- | ---- | ---- |
| 05.aad.1.1.1.sql | grant | usage | schema aad_schema_1_1_1 | guest_aad |
| 05.aad.1.1.1.sql | grant | usage | schema aad_schema_1_1_1 | editor_aad |
| 05.aad.1.1.1.sql | grant | usage | schema aad_schema_1_1_1 | process_logger_role |
| 05.aad.1.1.1.sql | grant | insert | aad_schema_1_1_1.adopt_a_drain | guest_aad -- C |
| 05.aad.1.1.1.sql | grant | select | aad_schema_1_1_1.adopt_a_drain | guest_aad -- R, signin |
| 05.aad.1.1.1.sql | grant | insert | aad_schema_1_1_1.adopt_a_drain | editor_aad -- C |
| 05.aad.1.1.1.sql | grant | update | aad_schema_1_1_1.adopt_a_drain | editor_aad -- U |
| 05.aad.1.1.1.sql | grant | select | aad_schema_1_1_1.adopt_a_drain | editor_aad -- R |
| 05.aad.1.1.1.sql | grant | insert | aad_schema_1_1_1.adopt_a_drain | process_logger_role -- C |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.adopt_a_drain_upsert_trigger_func | guest_aad |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.adopt_a_drain_upsert_trigger_func | editor_aad |
| 05.aad.1.1.1.sql | grant | TRIGGER | aad_schema_1_1_1.adopt_a_drain | guest_aad |
| 05.aad.1.1.1.sql | grant | TRIGGER | aad_schema_1_1_1.adopt_a_drain | editor_aad |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.process_logger(JSONB) | process_logger_role -- upsert |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.process_logger_validate(JSONB) | process_logger_role -- upsert |
| 05.aad.1.1.1.sql | grant | usage | schema aad_schema_1_1_1 | process_logger_role |
| 05.aad.1.1.1.sql | grant | insert | aad_schema_1_1_1.adopt_a_drain | process_logger_role -- C ... 'app' only |
| 05.aad.1.1.1.sql | grant | select | aad_schema_1_1_1.adopt_a_drain | process_logger_role -- R ... 'owner', 'app' |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.adopt_a_drain_upsert_trigger_func | process_logger_role |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.http_response(TEXT, TEXT) | guest_aad -- C |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.http_response(TEXT, TEXT) | editor_aad -- C |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.is_valid_token(TEXT, TEXT) | guest_aad -- C |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.is_valid_token(TEXT, TEXT) | editor_aad -- C |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.app_validate(JSONB) | editor_aad |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.app(JSON) | editor_aad -- C |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.app(TEXT) | editor_aad -- C |
| 05.aad.1.1.1.sql | grant | guest_aad | authenticator |
| 05.aad.1.1.1.sql | grant | editor_aad | authenticator |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.signin_validate(JSONB) | guest_aad -- upsert |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.signin(JSON) | guest_aad -- upsert |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.adopter(JSON) | guest_aad -- upsert |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.adopter(JSON) | editor_aad -- upsert |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.adopter_validate(JSONB) | guest_aad -- upsert |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.adopter_validate(JSONB) | editor_aad -- upsert |
| 05.aad.1.1.1.sql | grant | EXECUTE | FUNCTION aad_schema_1_1_1.adopter(JSON) | editor_aad -- select |
# 06.aad.1.2.0.sql


## Changes


| status | version | detail |
| ------ | ------- | ------ |
| Done | 1.2.0 | Add Adpotee |
| Done | 1.2.0 | Rename schema from aad_schema_1_2_0 to aad_version_1_2_0 |


## Functions


| version | name | returns |
| ------- | ------- | ------ |
|  aad_version_1_2_0 | adopt_a_drain_upsert_trigger_func()  |  TRIGGER |
|  aad_version_1_2_0 | process_logger(_form JSONB)  |  JSONB |
|  aad_version_1_2_0 | process_logger_validate(form JSONB)  |  JSONB |
|  aad_version_1_2_0 | http_response(_status text, _msg text)  |  JSON |
|  aad_version_1_2_0 | is_valid_token(_token TEXT, expected_role TEXT)  |  Boolean |
|  aad_version_1_2_0 | app_validate(form JSONB)  |  JSONB |
|  aad_version_1_2_0 | app(form JSON)  |  JSONB |
|  aad_version_1_2_0 | app(id TEXT)  |  JSONB |
|  aad_version_1_2_0 | signin_validate(form JSONB)  |  JSONB |
|  aad_version_1_2_0 | signin(form JSON)  |  JSONB |
|  aad_version_1_2_0 | adopter(form JSON)  |  JSONB |
|  aad_version_1_2_0 | adopter_validate(form JSONB)  |  JSONB |
|  aad_version_1_2_0 | adopter(id TEXT)  |  JSONB |
|  aad_version_1_2_0 | adoptee_validate(form JSONB)  |  JSONB |
|  aad_version_1_2_0 | adoptee(form JSON)  |  JSONB |
|  aad_version_1_2_0 | adoptee(id TEXT)  |  JSONB |


## Script Pattern


| file | type | detail |
| ---- | ------- | ------ |
| 06.aad.1.2.0.sql | SCHEMA | Create Schema |
| 06.aad.1.2.0.sql | DATABASE | Alter app.settings |
| 06.aad.1.2.0.sql | GRANT | Grant Schema Permissions |
| 06.aad.1.2.0.sql | SCHEMA | Set Schema Path |
| 06.aad.1.2.0.sql | TYPE | Create Types |
| 06.aad.1.2.0.sql | TABLE | Create Table |
| 06.aad.1.2.0.sql | INDEX | Create Index |
| 06.aad.1.2.0.sql | GRANT | Grant Table Permissions |
| 06.aad.1.2.0.sql | FUNCTION | Table Trigger |
| 06.aad.1.2.0.sql | GRANT | Grant Execute |
| 06.aad.1.2.0.sql | TRIGGER | Create Table Trigger |
| 06.aad.1.2.0.sql | FUNCTION | Create process_logger(_form JSONB) |
| 06.aad.1.2.0.sql | GRANT | Grant Execute |
| 06.aad.1.2.0.sql | FUNCTION | Create process_logger_validate(form JSONB) |
| 06.aad.1.2.0.sql | GRANT | Grant Execute |
| 06.aad.1.2.0.sql | GRANT | GRANT Schema permissions |
| 06.aad.1.2.0.sql | GRANT | Grant Table permissions to process_logger_role |
| 06.aad.1.2.0.sql | GRANT | Grant Trigger Permissions to process_logger_role |
| 06.aad.1.2.0.sql | FUNCTION | Create http_response(_status text, _msg text) |
| 06.aad.1.2.0.sql | GRANT | Grant Function Permissions |
| 06.aad.1.2.0.sql | FUNCTION | Create is_valid_token(_token TEXT, expected_role TEXT) |
| 06.aad.1.2.0.sql | GRANT | Grant Function Permissions |
| 06.aad.1.2.0.sql | USER | Setup woden user |
| 06.aad.1.2.0.sql | FUNCTION | Create app_validate(form JSONB) |
| 06.aad.1.2.0.sql | GRANT | Grant Execute |
| 06.aad.1.2.0.sql | FUNCTION | Create app(form JSON) |
| 06.aad.1.2.0.sql | GRANT | Grant Execute |
| 06.aad.1.2.0.sql | FUNCTION | Create app(id TEXT) |
| 06.aad.1.2.0.sql | GRANT | Grant Execute |
| 06.aad.1.2.0.sql | GRANT | Grant authenticator more permissions |
| 06.aad.1.2.0.sql | FUNCTION | Create signin_validate(form JSONB) |
| 06.aad.1.2.0.sql | GRANT | Grant Execute |
| 06.aad.1.2.0.sql | FUNCTION | Create aad_version_1_2_0.signin(form JSON) |
| 06.aad.1.2.0.sql | $$ LANGUAGE plpgsql;GRANT | Grant Execute |
| 06.aad.1.2.0.sql | FUNCTION | Create adopter(form JSON) |
| 06.aad.1.2.0.sql | GRANT | Grant Execute |
| 06.aad.1.2.0.sql | FUNCTION | Create adopter_validate(form JSONB) |
| 06.aad.1.2.0.sql | GRANT | Grant Execute |
| 06.aad.1.2.0.sql | FUNCTION | Create adopter(id TEXT) |
| 06.aad.1.2.0.sql | GRANT | Grant Execute |
| 06.aad.1.2.0.sql | FUNCTION | Create adoptee_validate(form JSONB) |
| 06.aad.1.2.0.sql | GRANT | Grant Execute |
| 06.aad.1.2.0.sql | FUNCTION | Create adoptee(form JSON) |
| 06.aad.1.2.0.sql | GRANT | Grant Execute adoptee |
| 06.aad.1.2.0.sql | FUNCTION | Create adoptee(id TEXT) |
| 06.aad.1.2.0.sql | GRANT | Grant Execute |


## Permissions


| file | action | permission | on | to |
| ---- | ------ | ---------- | ---- | ---- |
| 06.aad.1.2.0.sql | grant | usage | schema aad_version_1_2_0 | guest_aad |
| 06.aad.1.2.0.sql | grant | usage | schema aad_version_1_2_0 | editor_aad |
| 06.aad.1.2.0.sql | grant | usage | schema aad_version_1_2_0 | process_logger_role |
| 06.aad.1.2.0.sql | grant | insert | aad_version_1_2_0.adopt_a_drain | guest_aad -- C |
| 06.aad.1.2.0.sql | grant | select | aad_version_1_2_0.adopt_a_drain | guest_aad -- R, signin |
| 06.aad.1.2.0.sql | grant | insert | aad_version_1_2_0.adopt_a_drain | editor_aad -- C |
| 06.aad.1.2.0.sql | grant | update | aad_version_1_2_0.adopt_a_drain | editor_aad -- U |
| 06.aad.1.2.0.sql | grant | select | aad_version_1_2_0.adopt_a_drain | editor_aad -- R |
| 06.aad.1.2.0.sql | grant | insert | aad_version_1_2_0.adopt_a_drain | process_logger_role -- C |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.adopt_a_drain_upsert_trigger_func | guest_aad |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.adopt_a_drain_upsert_trigger_func | editor_aad |
| 06.aad.1.2.0.sql | grant | TRIGGER | aad_version_1_2_0.adopt_a_drain | guest_aad |
| 06.aad.1.2.0.sql | grant | TRIGGER | aad_version_1_2_0.adopt_a_drain | editor_aad |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.process_logger(JSONB) | process_logger_role -- upsert |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.process_logger_validate(JSONB) | process_logger_role -- upsert |
| 06.aad.1.2.0.sql | grant | usage | schema aad_version_1_2_0 | process_logger_role |
| 06.aad.1.2.0.sql | grant | insert | aad_version_1_2_0.adopt_a_drain | process_logger_role -- C ... 'app' only |
| 06.aad.1.2.0.sql | grant | select | aad_version_1_2_0.adopt_a_drain | process_logger_role -- R ... 'owner', 'app' |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.adopt_a_drain_upsert_trigger_func | process_logger_role |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.http_response(TEXT, TEXT) | guest_aad -- C |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.http_response(TEXT, TEXT) | editor_aad -- C |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.is_valid_token(TEXT, TEXT) | guest_aad -- C |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.is_valid_token(TEXT, TEXT) | editor_aad -- C |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.app_validate(JSONB) | editor_aad |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.app(JSON) | editor_aad -- C |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.app(TEXT) | editor_aad -- C |
| 06.aad.1.2.0.sql | grant | guest_aad | authenticator |
| 06.aad.1.2.0.sql | grant | editor_aad | authenticator |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.signin_validate(JSONB) | guest_aad -- upsert |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.signin(JSON) | guest_aad -- upsert |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.adopter(JSON) | guest_aad -- upsert |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.adopter(JSON) | editor_aad -- upsert |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.adopter_validate(JSONB) | guest_aad -- upsert |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.adopter_validate(JSONB) | editor_aad -- upsert |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.adopter(JSON) | editor_aad -- select |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.adoptee_validate(JSONB) | editor_aad |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.adoptee(JSON) | editor_aad -- C |
| 06.aad.1.2.0.sql | grant | EXECUTE | FUNCTION aad_version_1_2_0.adoptee(TEXT) | editor_aad -- C |
# 07.aad.1.2.1.sql


## Changes


| status | version | detail |
| ------ | ------- | ------ |
| __PAUSE__ | 1.2.1 | Change "process" type to "event" type |
| __PAUSE__ | 1.2.1 | Change Process_logger to event_logger |
| __PAUSE__ | 1.2.1 | Change 1_2_0 to 1_2_1 |
| __PAUSE__ | 1.2.1 | Create add_base schema |
| __PAUSE__ | 1.2.1 | Move adopt_a_drain table to aad_base schema |
| __PAUSE__ | 1.2.1 | stop insert of duplicate adoptee |
| __PAUSE__ | 1.2.1 | add reg_data to adopter insert |
| __PAUSE__ | 1.2.1 | add reg_data to adoptee insert |
| __PAUSE__ | 1.2.1 | add reg_ata to signin |


## Functions


| version | name | returns |
| ------- | ------- | ------ |
|  aad_version_1_2_1 | signin_validate(form JSONB)  |  JSONB |
|  aad_version_1_2_1 | signin(form JSON)  |  JSONB |
|  aad_version_1_2_1 | signin(form JSON)  |  JSONB |
|  aad_version_1_2_1 | adopter(form JSON)  |  JSONB |
|  aad_version_1_2_1 | adopter_validate(form JSONB)  |  JSONB |
|  aad_version_1_2_1 | adopter(id TEXT)  |  JSONB |
|  aad_version_1_2_1 | adoptee_validate(form JSONB)  |  JSONB |
|  aad_version_1_2_1 | adoptee(form JSON)  |  JSONB |
|  aad_version_1_2_1 | adoptee(id TEXT)  |  JSONB |


## Script Pattern


| file | type | detail |
| ---- | ------- | ------ |
| 07.aad.1.2.1.sql | SCHEMA | Create Schema |
| 07.aad.1.2.1.sql | DATABASE | Alter app.settings |
| 07.aad.1.2.1.sql | GRANT | Grant Schema Permissions |
| 07.aad.1.2.1.sql | SCHEMA | Set Schema Path |
| 07.aad.1.2.1.sql | TYPE | Create Types |
| 07.aad.1.2.1.sql | FUNCTION | Create signin_validate(form JSONB) |
| 07.aad.1.2.1.sql | GRANT | Grant Execute |
| 07.aad.1.2.1.sql | FUNCTION | Create aad_version_1_2_1.signin(form JSON) |
| 07.aad.1.2.1.sql | $$ LANGUAGE plpgsql;GRANT | Grant Execute |
| 07.aad.1.2.1.sql | $$ LANGUAGE plpgsql;GRANT | Grant Execute |
| 07.aad.1.2.1.sql | FUNCTION | Create adopter(form JSON) |
| 07.aad.1.2.1.sql | GRANT | Grant Execute |
| 07.aad.1.2.1.sql | FUNCTION | Create adopter_validate(form JSONB) |
| 07.aad.1.2.1.sql | GRANT | Grant Execute |
| 07.aad.1.2.1.sql | FUNCTION | Create adopter(id TEXT) |
| 07.aad.1.2.1.sql | GRANT | Grant Execute |
| 07.aad.1.2.1.sql | FUNCTION | Create adoptee_validate(form JSONB) |
| 07.aad.1.2.1.sql | GRANT | Grant Execute |
| 07.aad.1.2.1.sql | FUNCTION | Create adoptee(form JSON) |
| 07.aad.1.2.1.sql | GRANT | Grant Execute adoptee |
| 07.aad.1.2.1.sql | FUNCTION | Create adoptee(id TEXT) |
| 07.aad.1.2.1.sql | GRANT | Grant Execute |


## Permissions


| file | action | permission | on | to |
| ---- | ------ | ---------- | ---- | ---- |
| 07.aad.1.2.1.sql | grant | usage | schema aad_base | guest_aad |
| 07.aad.1.2.1.sql | grant | usage | schema aad_base | editor_aad |
| 07.aad.1.2.1.sql | grant | usage | schema aad_base | event_logger_role |
| 07.aad.1.2.1.sql | grant | usage | schema aad_version_1_2_1 | guest_aad |
| 07.aad.1.2.1.sql | grant | usage | schema aad_version_1_2_1 | editor_aad |
| 07.aad.1.2.1.sql | grant | usage | schema aad_version_1_2_1 | event_logger_role |
| 07.aad.1.2.1.sql | grant | EXECUTE | FUNCTION aad_version_1_2_1.signin_validate(JSONB) | guest_aad |
| 07.aad.1.2.1.sql | grant | EXECUTE | FUNCTION aad_version_1_2_1.signin(JSON) | guest_aad |
| 07.aad.1.2.1.sql | grant | EXECUTE | FUNCTION aad_version_1_2_1.signin(JSON) | guest_aad |
| 07.aad.1.2.1.sql | grant | EXECUTE | FUNCTION aad_version_1_2_1.adopter(JSON) | guest_aad -- upsert |
| 07.aad.1.2.1.sql | grant | EXECUTE | FUNCTION aad_version_1_2_1.adopter(JSON) | editor_aad -- upsert |
| 07.aad.1.2.1.sql | grant | EXECUTE | FUNCTION aad_version_1_2_1.adopter_validate(JSONB) | guest_aad -- upsert |
| 07.aad.1.2.1.sql | grant | EXECUTE | FUNCTION aad_version_1_2_1.adopter_validate(JSONB) | editor_aad -- upsert |
| 07.aad.1.2.1.sql | grant | EXECUTE | FUNCTION aad_version_1_2_1.adopter(JSON) | editor_aad -- select |
| 07.aad.1.2.1.sql | grant | EXECUTE | FUNCTION aad_version_1_2_1.adoptee_validate(JSONB) | editor_aad |
| 07.aad.1.2.1.sql | grant | EXECUTE | FUNCTION aad_version_1_2_1.adoptee(JSON) | editor_aad -- C |
| 07.aad.1.2.1.sql | grant | EXECUTE | FUNCTION aad_version_1_2_1.adoptee(TEXT) | editor_aad -- C |
# 90.aad.1.1.0.tests.sql


## Changes


| status | version | detail |
| ------ | ------- | ------ |


## Functions


| version | name | returns |
| ------- | ------- | ------ |


## Script Pattern


| file | type | detail |
| ---- | ------- | ------ |
| 90.aad.1.1.0.tests.sql | TEST | Test app Insert |
| 90.aad.1.1.0.tests.sql | TEST | Test app Select |
| 90.aad.1.1.0.tests.sql | TEST | Test owner Insert |
| 90.aad.1.1.0.tests.sql | TEST | Test process_logger Insert |
| 90.aad.1.1.0.tests.sql | TEST | Test(a) owner Insert |
| 90.aad.1.1.0.tests.sql | TEST | Test(b) signin Insert |
# 90.aad.1.1.1.tests.sql


## Changes


| status | version | detail |
| ------ | ------- | ------ |


## Functions


| version | name | returns |
| ------- | ------- | ------ |


## Script Pattern


| file | type | detail |
| ---- | ------- | ------ |
| 90.aad.1.1.1.tests.sql | TEST | Test app Insert |
| 90.aad.1.1.1.tests.sql | TEST | Test app Select |
| 90.aad.1.1.1.tests.sql | TEST | Test process_logger Insert |
| 90.aad.1.1.1.tests.sql | TEST | Test(a) adopter Insert |
| 90.aad.1.1.1.tests.sql | TEST | Test(b) signin Insert |
# 90.aad.1.2.0.tests.sql


## Changes


| status | version | detail |
| ------ | ------- | ------ |


## Functions


| version | name | returns |
| ------- | ------- | ------ |


## Script Pattern


| file | type | detail |
| ---- | ------- | ------ |
| 90.aad.1.2.0.tests.sql | TEST | Test app Insert |
| 90.aad.1.2.0.tests.sql | TEST | Test app Select |
| 90.aad.1.2.0.tests.sql | TEST | Test process_logger Insert |
| 90.aad.1.2.0.tests.sql | TEST | Test(a) adopter Insert |
| 90.aad.1.2.0.tests.sql | TEST | Test(b) signin Insert |
| 90.aad.1.2.0.tests.sql | TEST | Test(a) adopter Insert |
| 90.aad.1.2.0.tests.sql | TEST | Test(b) signin Insert |
| 90.aad.1.2.0.tests.sql | TEST | Test(a) adopter Insert |
# 90.aad.1.2.1.tests.sql


## Changes


| status | version | detail |
| ------ | ------- | ------ |


## Functions


| version | name | returns |
| ------- | ------- | ------ |


## Script Pattern


| file | type | detail |
| ---- | ------- | ------ |
| 90.aad.1.2.1.tests.sql | TEST | Test event_logger Insert |
| 90.aad.1.2.1.tests.sql | TEST | Test(a) adopter Insert |
| 90.aad.1.2.1.tests.sql | TEST | Test(b) signin Insert |
| 90.aad.1.2.1.tests.sql | TEST | Test(a) adopter Insert |

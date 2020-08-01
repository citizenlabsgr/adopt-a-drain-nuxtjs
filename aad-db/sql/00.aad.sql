\c postgres

-- create db object
-- create role
-- create role permissions
-- create user
-- assign user to role
-- do something
-- drop db object


---------------
-- ISSUES: Common Issues and Solutions
/*

* todo: use two functions (overload) for update and insert instead of single function
  ???? app(JSON) and app(TEXT, JSON)

* issue: permission denied to set role
  try: granting guest_aad to postgres ... didnt work
  try: checking that environmen vars are not empty ... not empty
  Try: makeing an new starter-token
  Try: check jwt.io and remove any trailing eol in encoded
  something is missing, look in aad.1.0.0 runs with aad.1.0.0 added to startup
  Try: add grant guest_aad to authenticator; ... that's it... this time

* issue: AUTHORIZED_USER is {"hint":null,"details":null,"code":"42501","message":"permission denied to set role \"guest_aad\""}
  ???? added insert privileges to editor_aad but now gives "Not valid base64url"
  try: remove any end of line characters from ???

* issue: {"message":"JWSError (JSONDecodeError \"Not valid base64url\")"}
  resolution: token contains extra characters. in this case the token is wrapped in double quotes, remove quotes before using Token


* issue: ERROR:  database "aad_db" already exists
    resolution: DROP DATABASE IF EXISTS aad_db;

* issue: "Server lacks JWT secret"
    resolution: (add PGRST_JWT_SECRET to Postrest part of docker-compose)

* issue: "JWSError JWSInvalidSignature"
    resoluton: make sure WODEN is set in client environment
    resolution: (check the docker-compose PGRST_JWT_SECRET password value, should be same as app.settings.jwt_secret value)
    resolution: (check that sign() is using the correct JWT_SECRET value)
    resolution: (replace the WODEN envirnement variable called by curl)
    resolution: POSTGRES_SCHEMA and PGRST_DB_SCHEMA should be the same
    resolution: remove image, docker rmi reg_db
    resolution: put quotes around the export WORDEN=""
    try: ?payoad in trigger has to match payload in woden function?
    try: set env variables out side of  client
    try: reboot

* issue: "hint":"No function matches the given name and argument types. You might need to add explicit type casts.","details":null,"code":"42883","message":"function app(type => text) does not exist"
    evaluation: looks like the JSONB type doesnt translate via curl. JSON object is passed as TEXT. Postgres doesnt have a method pattern that matches "app(TEXT)"
    resolution: didnt work ... rewrite app(JSONB) to app(TEXT), cast the text to JSONB once passed to function.
    evaluation: curl -d '{"mytype": "app","myval": "xxx"}' is interpeted as two text parameters rather than one JSON parameter
    resolution: add header ... -H "Prefer: params=single-object" to curl call
    read: http://postgrest.org/en/v7.0.0/

* issue:
    evaluation: sign method not matching parameters. passing JSONB when should be passing JSON
    resolution: update trigger to cast _form to _form::JSON for token creation

* issue:
    description: status:500 when insert on table with trigger
    evaluation: user must have TRIGGER  permissions on table
    evaluation: user must have EXECUTE permissions on trigger functions

* issue:
    unrecognized configuration parameter \"request.jwt.claim.type
    evaluation: the WODEN env variable isnt set
    resolution: export WODEN='paste a valid a token here'

* issue:
      description: FATAL:  password authentication failed for user "authenticator"
      evaluation: password changes seem to cause this
      try: removing the docker images...docker rmi aad_db

* issue:
      schema \"reg_schema\" does not exist
      try: docker rmi aad_db ... didnt work
      try: reboot... didnt work
      try: check docker-compose.yml, change POSTGRES_SCHEMA to match
      try: dropping postgres images
      try: setting the tolken value ... OK

extra code
      \set postgres_password `echo "'$POSTGRES_PASSWORD'"`
      \set postgres_jwt_secret `echo "'$POSTGRES_JWT_SECRET'"`
      \set lb_guest_password `echo "'$LB_GUEST_PASSWORD'"`

      select
        :postgres_password as postgres_password,
        :postgres_jwt_secret as postgres_jwt_secret,
        :lb_guest_password as lb_guest_password;
        --:pgrst_db_uri as pgrst_db_uri;
*/

--------------
-- Environment: Read environment variables
--------------

\set postgres_jwt_secret `echo "'$POSTGRES_JWT_SECRET'"`
\set lb_guest_password `echo "'$LB_GUEST_PASSWORD'"`
\set lb_woden `echo "'$LB_WODEN'"`
--select :lb_guest_password;
--select :postgres_jwt_secret ;
--select :lb_woden ;
--------------
-- DATABASE
--------------
-- DATABASE: Drop Database
DROP DATABASE IF EXISTS aad_db;
-- DATABASE: Create Database
CREATE DATABASE aad_db;

---------------
-- Security, dont let users create anything in public
---------------
-- REVOKE CREATE ON SCHEMA public FROM PUBLIC;

\c aad_db

-- DATABASE: Create Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;;
CREATE EXTENSION IF NOT EXISTS pgtap;;
CREATE EXTENSION IF NOT EXISTS pgjwt;;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLE: Create Roles

CREATE ROLE authenticator noinherit login password :lb_guest_password ;

CREATE ROLE guest_aad nologin noinherit; -- permissions to execute app() and insert type=owner into aad_schema_1_0_0.adopt_a_drain
CREATE ROLE editor_aad nologin noinherit; -- permissions to execute app() and insert type=app into aad_schema_1_0_0.adopt_a_drain
CREATE ROLE process_logger_role nologin;

-- grant guest_aad to postgres;

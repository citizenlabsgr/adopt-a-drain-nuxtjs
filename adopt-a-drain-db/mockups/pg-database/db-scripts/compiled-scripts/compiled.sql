-- Built from files in ./adopt-a-drain/adopt-a-drain-db/mockups/pg-database/db-scripts
------------
-- ./adopt-a-drain/adopt-a-drain-db/mockups/pg-database/db-scripts/01.create.api.sql
------------
--postgres=# \l
\c postgres
DROP DATABASE IF EXISTS aad_db;
CREATE DATABASE aad_db;
-- SET DB
\c aad_db
select '-- create.api.A';
create schema if not exists aad_schema;
select '-- create.api.B';
create extension pgcrypto;
CREATE EXTENSION pgtap;
CREATE EXTENSION pgjwt;
select '-- create.api.C';
SET search_path TO aad_schema, public; -- put everything in api_schema;
select '-- create.api.OUT';
------------
-- ./adopt-a-drain/adopt-a-drain-db/mockups/pg-database/db-scripts/02.create.table.users.sql
------------
---- SET DB
\c aad_db
select '-- create.table.users A';
create table if not exists
aad_schema.users (
  usr_id SERIAL PRIMARY KEY,
  usr_email text check ( usr_email ~* '^.+@.+\..+$' ),
  usr_pass text not null check (length(usr_pass) < 512),
  usr_first_name character varying,
	usr_last_name character varying,
  usr_role text not null check (length(usr_role) < 512),
  usr_active BOOLEAN NOT NULL DEFAULT true
);
select '-- create.table.users B';
CREATE UNIQUE INDEX IF NOT EXISTS users_usr_id_pkey ON aad_schema.users(usr_id int4_ops);
select '-- create.table.users C';
CREATE UNIQUE INDEX IF NOT EXISTS index_users_on_usr_email ON aad_schema.users(usr_email text_ops);
select '-- create.table.users out';
------------
-- ./adopt-a-drain/adopt-a-drain-db/mockups/pg-database/db-scripts/03.create.type.sql
------------
--\c aad_db
--select 'create.type A';
--DROP TYPE IF EXISTS aad_schema.jwt_claims CASCADE;
--select 'create.type B';
--CREATE TYPE aad_schema.jwt_claims AS (role TEXT, email TEXT);
--select 'create.type C';
--select 'create.type OUT';
------------
-- ./adopt-a-drain/adopt-a-drain-db/mockups/pg-database/db-scripts/04.0.create.function.signup.sql
------------
\c aad_db
select '-- create.function.signup A';
CREATE OR REPLACE FUNCTION
aad_schema.signup(username text, password text) RETURNS VOID
AS $$
  INSERT INTO aad_schema.users (usr_email, usr_pass, usr_role) VALUES
    (signup.username, crypt(signup.password, gen_salt('bf', 8)), 'editor');
$$ LANGUAGE sql;
select '-- create.function.signup out';
------------
-- ./adopt-a-drain/adopt-a-drain-db/mockups/pg-database/db-scripts/04.1.create.function.signin.sql
------------
\c aad_db
-- ref: https://github.com/PostgREST/postgrest/issues/783
-- ref: https://dba.stackexchange.com/questions/52235/how-can-i-use-an-environment-variable-in-a-postgres-function
select '-- create.function.signin A';
CREATE OR REPLACE FUNCTION
aad_schema.signin(username TEXT, password TEXT) RETURNS TEXT
AS $$
  DECLARE last_id int;
  DECLARE rc varchar(500);
  DECLARE tmpl varchar(500);
  DECLARE payload varchar(500);
  DECLARE secret varchar(500);
  DECLARE token TEXT;
BEGIN
  -- secret needs to be moved to environment variable
  secret := 'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG';
  tmpl := '{''id'': %s,''name'': ''%s'',''token'': ''%s''}';
  SELECT usr_id into last_id FROM aad_schema.users
    WHERE usr_email = lower(signin.username)
    AND usr_pass = crypt(signin.password, usr_pass);
  if FOUND then
    payload := format('{"role":"editor","name":"%s"}', signin.username);
    token := sign(payload::json, secret);
    rc := format(tmpl, last_id::VARCHAR(15), signin.username, token);
  else
    rc := format(tmpl, '-1', signin.username, '');
  end if;
  RETURN rc;
END;  $$ LANGUAGE plpgsql;
select '-- create.function.signin out';
------------
-- ./adopt-a-drain/adopt-a-drain-db/mockups/pg-database/db-scripts/06.roles.users.sql
------------
\c aad_db
---- SET DB
----\c dbname=adoptadrain
SELECT '-- role.users A';
CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'mysecretpassword';
CREATE ROLE guest;
CREATE ROLE anonymous;
SELECT '-- role.users E1';
GRANT USAGE ON SCHEMA aad_schema TO anonymous;
GRANT USAGE ON SCHEMA aad_schema TO guest;
GRANT anonymous, guest TO authenticator;
SELECT '-- role.users F';
GRANT SELECT, INSERT ON TABLE aad_schema.users TO guest;
SELECT '-- role.users G';
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA aad_schema to guest;
SELECT '-- role.users H';
GRANT SELECT, INSERT ON TABLE aad_schema.users TO anonymous;
SELECT '-- role.users I';
GRANT EXECUTE ON FUNCTION
  aad_schema.signup(text, text)
  TO anonymous;
GRANT EXECUTE ON FUNCTION
  aad_schema.signin(text, text)
  TO anonymous;
SELECT '-- role.users OUT';
------------
-- ./adopt-a-drain/adopt-a-drain-db/mockups/pg-database/db-scripts/21.tests.sql
------------
\c aad_db
select '##### TESTS';
BEGIN;
SELECT plan(14);
SELECT
  is(sign('{"sub":"1234567890","name":"John Doe","admin":true}', 'secret'),
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ');
SELECT
  is(sign('{"sub":"1234567890","name":"John Doe","admin":true}', 'secret', 'HS256'),
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ');
SELECT
  throws_ok($$
    SELECT sign('{"sub":"1234567890","name":"John Doe","admin":true}', 'secret', 'bogus')
    $$,
    '22023',
    'Cannot use "": No such hash algorithm',
    'sign() should raise on bogus algorithm'
    );
SELECT
  throws_ok(
    $$SELECT header::text, payload::text, valid FROM verify(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
    'secret', 'bogus')$$,
    '22023',
    'Cannot use "": No such hash algorithm',
    'verify() should raise on bogus algorithm'
);
SELECT throws_ok( -- bogus header
    $$SELECT header::text, payload::text, valid FROM verify(
    'eyJhbGciOiJIUzI1NiIBOGUScCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
    'secret', 'HS256')$$
    );
SELECT
  throws_ok( -- bogus payload
    $$SELECT header::text, payload::text, valid FROM verify(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaBOGUS9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
    'secret', 'HS256')$$
);
SELECT
  results_eq(
    $$SELECT header::text, payload::text, valid FROM verify(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
    'secret')$$,
    $$VALUES ('{"alg":"HS256","typ":"JWT"}', '{"sub":"1234567890","name":"John Doe","admin":true}', true)$$,
    'verify() should return return data marked valid'
);
SELECT results_eq(
    $$SELECT header::text, payload::text, valid FROM verify(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
    'badsecret')$$,
    $$VALUES ('{"alg":"HS256","typ":"JWT"}', '{"sub":"1234567890","name":"John Doe","admin":true}', false)$$,
    'verify() should return return data marked invalid'
);
SELECT
  is(sign('{"sub":"1234567890","name":"John Doe","admin":true}', 'secret', 'HS384'),
  E'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.DtVnCyiYCsCbg8gUP-579IC2GJ7P3CtFw6nfTTPw-0lZUzqgWAo9QIQElyxOpoRm');
SELECT
  results_eq(
    $$SELECT header::text, payload::text, valid FROM verify(
    E'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.DtVnCyiYCsCbg8gUP-579IC2GJ7P3CtFw6nfTTPw-0lZUzqgWAo9QIQElyxOpoRm',
    'secret', 'HS384')$$,
    $$VALUES ('{"alg":"HS384","typ":"JWT"}', '{"sub":"1234567890","name":"John Doe","admin":true}', true)$$,
    'verify() should return return data marked valid'
);
SELECT
  results_eq(
    $$SELECT header::text, payload::text, valid FROM verify(
    E'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.DtVnCyiYCsCbg8gUP-579IC2GJ7P3CtFw6nfTTPw-0lZUzqgWAo9QIQElyxOpoRm',
    'badsecret', 'HS384')$$,
    $$VALUES ('{"alg":"HS384","typ":"JWT"}', '{"sub":"1234567890","name":"John Doe","admin":true}', false)$$,
    'verify() should return return data marked invalid'
);
SELECT
  is(sign('{"sub":"1234567890","name":"John Doe","admin":true}', 'secret', 'HS512'),
  E'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.YI0rUGDq5XdRw8vW2sDLRNFMN8Waol03iSFH8I4iLzuYK7FKHaQYWzPt0BJFGrAmKJ6SjY0mJIMZqNQJFVpkuw');
SELECT
  results_eq(
    $$SELECT header::text, payload::text, valid FROM verify(
    E'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.YI0rUGDq5XdRw8vW2sDLRNFMN8Waol03iSFH8I4iLzuYK7FKHaQYWzPt0BJFGrAmKJ6SjY0mJIMZqNQJFVpkuw',
    'secret', 'HS512')$$,
    $$VALUES ('{"alg":"HS512","typ":"JWT"}', '{"sub":"1234567890","name":"John Doe","admin":true}', true)$$,
    'verify() should return return data marked valid'
);
SELECT
  results_eq(
    $$SELECT header::text, payload::text, valid FROM verify(
    E'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.YI0rUGDq5XdRw8vW2sDLRNFMN8Waol03iSFH8I4iLzuYK7FKHaQYWzPt0BJFGrAmKJ6SjY0mJIMZqNQJFVpkuw',
    'badsecret', 'HS512')$$,
    $$VALUES ('{"alg":"HS512","typ":"JWT"}', '{"sub":"1234567890","name":"John Doe","admin":true}', false)$$,
    'verify() should return return data marked invalid'
);
SELECT * FROM finish();
ROLLBACK;
------------
-- ./adopt-a-drain/adopt-a-drain-db/mockups/pg-database/db-scripts/compiled-scripts
------------

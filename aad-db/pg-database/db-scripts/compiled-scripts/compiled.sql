-- Built from files in ./adopt-a-drain/adopt-a-drain-db/pg-database/db-scripts
------------
-- ./adopt-a-drain/adopt-a-drain-db/pg-database/db-scripts/01.create.db.sql
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
create extension IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pgtap;
CREATE EXTENSION IF NOT EXISTS pgjwt;
select '-- create.api.C';
SET search_path TO aad_schema, public; -- put everything in api_schema;
select '-- create.api.OUT';
------------
-- ./adopt-a-drain/adopt-a-drain-db/pg-database/db-scripts/02.create.table.users.sql
------------
---- SET DB
\c aad_db
select '-- create.table.users A';
create table if not exists
aad_schema.users (
  usr_id SERIAL PRIMARY KEY,
  usr_email text check ( usr_email ~* '^.+@.+\..+$' ),
  usr_password text not null check (length(usr_password) < 512),
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
-- ./adopt-a-drain/adopt-a-drain-db/pg-database/db-scripts/03.create.type.sql
------------
--\c aad_db
--select 'create.type A';
--DROP TYPE IF EXISTS aad_schema.jwt_claims CASCADE;
--select 'create.type B';
--CREATE TYPE aad_schema.jwt_claims AS (role TEXT, email TEXT);
--select 'create.type C';
--select 'create.type OUT';
------------
-- ./adopt-a-drain/adopt-a-drain-db/pg-database/db-scripts/04.00.get_role.function.sql
------------
\c aad_db
----------------------------------------------
CREATE OR REPLACE FUNCTION
aad_schema.get_role(token text) RETURNS TEXT
AS $$
  DECLARE data TEXT;
  DECLARE secret TEXT;
BEGIN

  -- this is bad but ok for dev. Need to figure out how to enable the environment variables in postgres
  secret := 'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG';
  select payload ->> 'role' as role into data  from verify(token, secret);
  -- parce data

  RETURN data;
END;  $$ LANGUAGE plpgsql;
------------
-- ./adopt-a-drain/adopt-a-drain-db/pg-database/db-scripts/04.00.get_username.function.sql
------------
\c aad_db
----------------------------------------------
CREATE OR REPLACE FUNCTION
aad_schema.get_username(token text) RETURNS TEXT
AS $$
  DECLARE data TEXT;
  DECLARE secret TEXT;
BEGIN

  -- this is bad but ok for dev. Need to figure out how to enable the environment variables in postgres
  secret := 'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG';
  select payload ->> 'username' as username into data  from verify(token, secret);
  -- parce data

  RETURN data;
END;  $$ LANGUAGE plpgsql;
------------
-- ./adopt-a-drain/adopt-a-drain-db/pg-database/db-scripts/04.00.is_valid_token.function.sql
------------
\c aad_db
---------------------------------------------
CREATE OR REPLACE FUNCTION
aad_schema.is_valid_token(token text) RETURNS Boolean
AS $$
  DECLARE good Boolean;
  DECLARE secret TEXT;
BEGIN
  -- cloak the secret
  -- process the token
  -- return true/false
  good:=false;
  -- this is bad but ok for dev. Need to figure out how to enable the environment variables in postgres
  secret := 'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG';
  select valid into good from verify(token, secret);
  RETURN good;
END;  $$ LANGUAGE plpgsql;
--------------------------------------------
CREATE OR REPLACE FUNCTION
aad_schema.is_valid_token(token TEXT, role TEXT) RETURNS Boolean
AS $$
  DECLARE good Boolean;
  DECLARE actual_role TEXT;
  DECLARE secret TEXT;
BEGIN
  -- cloak the secret
  -- process the token
  -- return true/false
  good:=false;
  -- this is bad but ok for dev. Need to figure out how to enable the environment variables in postgres
  secret := 'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG';
  select valid into good from verify(token, secret);

  select payload ->> 'role' as role into actual_role  from verify(token, secret);

  if good and role != actual_role then
    good := false;
  end if;

  RETURN good;
END;  $$ LANGUAGE plpgsql;
------------
-- ./adopt-a-drain/adopt-a-drain-db/pg-database/db-scripts/04.01.credential.sql
------------
\c aad_db
-------------------------------
-- INSERT
---------
-- credential(TEXT, TEXT)
CREATE OR REPLACE FUNCTION
aad_schema.credential(username TEXT, password TEXT) RETURNS TEXT
AS $$
    Declare rc TEXT;
    Declare id int;
    Declare role TEXT;
  BEGIN
    rc := '{"result":-1}';
    role := 'editor';
    -- guest should be
    BEGIN
          INSERT INTO aad_schema.users
            (usr_email, usr_password, usr_role)
            VALUES
            (username, crypt(password, gen_salt('bf', 8)), role);

      rc := '{"result":1}';
    EXCEPTION WHEN unique_violation THEN
      rc := '{"result":2}';
    END;
    RETURN rc;
  END;
$$ LANGUAGE plpgsql;
---------------------------------------
CREATE OR REPLACE FUNCTION
aad_schema.credential(token text, id int) RETURNS TEXT
AS $$
  DECLARE rc TEXT;
  DECLARE secret TEXT;
BEGIN
  -- returns a single user's info
  -- need to figure out postgres environment variables
  secret := 'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG';

  rc := '{"result":-1}';

  if aad_schema.is_valid_token(token) then
    select
    '{"id":' || usr_id || ',"email":"' || usr_email || '"}'
    into rc from
    aad_schema.users
    where usr_id=id;
    if rc is NULL then
      rc := '{"result":-1}';
    end if;
  end if;

  RETURN rc;
END;  $$ LANGUAGE plpgsql;
----------------------------------------
-- ref: https://github.com/PostgREST/postgrest/issues/783
-- ref: https://dba.stackexchange.com/questions/52235/how-can-i-use-an-environment-variable-in-a-postgres-function
----------------------------
-- SELECT
---------
-- user needs to be logged in to use this one
-- credential(TEXT,TEXT,TEXT)
CREATE OR REPLACE FUNCTION
aad_schema.credential(token TEXT, username TEXT, password TEXT) RETURNS TEXT
AS $$
  DECLARE rc TEXT;
  DECLARE payload TEXT;
  DECLARE secret varchar(500);
  DECLARE token TEXT;
BEGIN
  -- requires a valid token
  -- returns a token given a valid un and pw
  -- secret needs to be moved to environment variable
  secret := 'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG';
  rc := '{"result":-1}';
  if aad_schema.is_valid_token(token, 'guest') then
    SELECT '{"username":"' || usr_email || '","role":"' || usr_role || '"}'
      into payload FROM aad_schema.users
      WHERE usr_email = lower(username)
      AND usr_password = crypt(password, usr_password);
    if FOUND then
      token := sign(payload::json, secret);
      rc := format('{"token":"%s"}', token);
    else
      rc := '{"result":-2}';
    end if;
  end if;
  RETURN rc;
END;  $$ LANGUAGE plpgsql;


--------------------------------------------
-- Update
-- logged in version
---------
-- credential(TEXT,int,TEXT,TEXT)
-- change while logged in
CREATE OR REPLACE FUNCTION
aad_schema.credential(token text, id int, email text, password text) RETURNS TEXT
AS $$
    Declare rc TEXT;
  BEGIN
    rc := '{"result":-1}';
    rc := format('{"result":%s}', id);
    if aad_schema.is_valid_token(token, 'editor') then
      rc := '{"result":-2}';
      update aad_schema.users
        set
          usr_email=email,
          usr_password=crypt(password, gen_salt('bf', 8))
        where usr_id=id
        and usr_email=aad_schema.get_username(token);
      if FOUND then
        rc := '{"result":1}';
      end if;
    end if;
    RETURN rc;
  END;
$$ LANGUAGE plpgsql;
--------------------------------------------
-- Update
-- forgot password
---------
------------
-- ./adopt-a-drain/adopt-a-drain-db/pg-database/db-scripts/04.01.user.function.sql
------------
\c aad_db
-- INSERT
-- select
-- UPDATE
-- DELETE

--------------------------------------------
-- INSERT
---------
-- use case: initiate a new user
-- prerequisite: guest user
CREATE OR REPLACE FUNCTION
aad_schema.user(token TEXT, first text, last text, email text, password text) RETURNS TEXT
AS $$
    Declare rc TEXT;
    Declare role TEXT;
    Declare id int;
  BEGIN
    rc := '{"result",-1}';
    role := aad_schema.get_role(token);
    BEGIN
      if aad_schema.is_valid_token(token,'guest') then
        rc := '{"result",-2}';
        INSERT INTO aad_schema.users
          (usr_first_name, usr_last_name, usr_email, usr_password, usr_role)
          VALUES
          (first, last, email, crypt(password, gen_salt('bf', 8)), role)
          returning id into id;
          rc := '{"result":1}';
      end if;
    EXCEPTION WHEN unique_violation THEN
      rc := '{"result",-3}';
    END;
    RETURN rc;
  END;
$$ LANGUAGE plpgsql;

-------------------------------------------
-- SELECT
---------
-- user(TEXT, int)
CREATE OR REPLACE FUNCTION
aad_schema.user(token text, id int) RETURNS TEXT
AS $$
  DECLARE rc TEXT;
  DECLARE secret TEXT;
BEGIN
  -- returns a single user's info
  -- need to figure out postgres environment variables
  secret := 'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG';

  rc := '{"result":-1}';

  if aad_schema.is_valid_token(token) then
    select
    '{"id":' || usr_id || ',"first":"' || usr_first_name || '","last":"' || usr_last_name || '","email":"' || usr_email || '"}'
    into rc from
    aad_schema.users
    where usr_id=id;
    if rc is NULL then
      rc := '{"result":-1}';
    end if;
  end if;

  RETURN rc;
END;  $$ LANGUAGE plpgsql;
--------------------------------------------
-- Update
---------
-- user(TEXT,int,TEXT,TEXT,TEXT)
/*
CREATE OR REPLACE FUNCTION
aad_schema.user(token text, first text, last text, email text, password text) RETURNS TEXT
AS $$
    Declare rc TEXT;
    Declare role TEXT;
  BEGIN
    rc := '{"result":-1}';
    BEGIN
      if aad_schema.is_valid_token(token) then
        rc := '{"result":-2}';
        if id < 0 THEN
          role := 'editor';
          INSERT INTO aad_schema.users
            (usr_first_name, usr_last_name, usr_email, usr_role)
            VALUES
            (first, last, email, role)
            returning id;
          rc := format('{"result":%s}',id);
        end if;
      end if;
    EXCEPTION WHEN unique_violation THEN
      -- do nothing
    END;
    RETURN rc;
  END;
$$ LANGUAGE plpgsql;
*/

CREATE OR REPLACE FUNCTION
aad_schema.user(token text, id int, first text, last text, email text) RETURNS TEXT
AS $$
    Declare rc TEXT;
  BEGIN
    rc := '{"result":-1}';
    if aad_schema.is_valid_token(token, 'editor') then
      rc := '{"result":-2}';
      rc := format('{"result":"%s"}',aad_schema.get_username(token));
      update aad_schema.users
        set
          usr_first_name=first,
          usr_last_name=last,
          usr_email=email
        where usr_id=id
          and usr_email=aad_schema.get_username(token);
      if FOUND then
        rc := '{"result":1}';
      end if;
    end if;
    RETURN rc;
  END;
$$ LANGUAGE plpgsql;
------------
-- ./adopt-a-drain/adopt-a-drain-db/pg-database/db-scripts/06.init.sql
------------
\c aad_db

-- setup guest credential
DO $$
  DECLARE rc TEXT;
  DECLARE username TEXT;
  DECLARE password TEXT;
  DECLARE id int;
BEGIN
  username := 'guest@aad.com';
  password := 'a1A!aaaa';
  TRUNCATE TABLE aad_schema.users;
  INSERT INTO aad_schema.users
    (usr_first_name, usr_last_name, usr_email, usr_password, usr_role)
    VALUES
    ('guest', 'guest', username, crypt(password, gen_salt('bf', 8)), 'guest');
END $$ LANGUAGE plpgsql;
------------
-- ./adopt-a-drain/adopt-a-drain-db/pg-database/db-scripts/06.roles.users.sql
------------
\c aad_db
---- SET DB
----\c dbname=adoptadrain
SELECT '-- role.users A';
CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'mysecretpassword';
CREATE ROLE guest;
CREATE ROLE anonymous;
CREATE ROLE editor;

SELECT '-- role.users E1';
GRANT USAGE ON SCHEMA aad_schema TO anonymous;
GRANT USAGE ON SCHEMA aad_schema TO guest;
GRANT USAGE ON SCHEMA aad_schema TO editor;

GRANT anonymous, guest TO authenticator;

SELECT '-- role.users F';
GRANT SELECT, INSERT ON TABLE aad_schema.users TO guest;

SELECT '-- role.users G';
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA aad_schema to guest;

SELECT '-- role.users H';
GRANT SELECT, INSERT ON TABLE aad_schema.users TO anonymous;

SELECT '-- role.users I';

GRANT EXECUTE ON FUNCTION
  aad_schema.credential(TEXT, TEXT)
  TO anonymous;

GRANT EXECUTE ON FUNCTION
  aad_schema.credential(TEXT, TEXT, TEXT)
  TO anonymous;
GRANT EXECUTE ON FUNCTION
  aad_schema.credential(TEXT,int,TEXT,TEXT)
  TO anonymous;

GRANT EXECUTE ON FUNCTION
  aad_schema.user(text, int)
  TO anonymous;
GRANT EXECUTE ON FUNCTION
  aad_schema.user(TEXT,int,TEXT,TEXT,TEXT)
  TO anonymous;


GRANT EXECUTE ON FUNCTION
  aad_schema.is_valid_token(text)
  TO anonymous;

SELECT '-- role.users OUT';
------------
-- ./adopt-a-drain/adopt-a-drain-db/pg-database/db-scripts/21.tests.sql
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
-- ./adopt-a-drain/adopt-a-drain-db/pg-database/db-scripts/210.function.tests.sql
------------
\c aad_db

select '##### Credential TESTS';
BEGIN;
SELECT plan(7);


--SELECT
-- credential(TEXT,TEXT)
SELECT is(
  aad_schema.credential(
    sign(
      '{"username":"guest@aad.com","role":"guest"}'::json,'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG'
    ),
    'noxample@aad.com',
    'a1A!aaaa'
  ),
  '{"result":-1}',
  'credential noxample@aad.com not found SELECT');

-- UPDATE
-- update credential
-- credential(TEXT, int, TEXT,TEXT)

SELECT is(
  aad_schema.credential(
    sign('{"username":"guest@aad.com","role":"guest"}'::json,'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG'),
    1,
    'guest@aad.com',
    'a1A!aaaa'
  ),
  '{"result":1}',
  'Credential guest@aad.com UPDATE'
);

------------------------------- USER
select '##### User TESTS';
-- INSERT
-- signup credential insert
-- credential(TEXT, TEXT)
SELECT is(
  aad_schema.user(
    sign(
      '{"username":"guest@aad.com","role":"guest"}'::json,'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG'
    ),
    'ex',
    'ample',
    'example@aad.com',
    'a1A!aaaa'
  ),
  '{"result":1}',
  'example@aad.com credential INSERT'
);

  -- SELECT
  -- user(TEXT, int )
SELECT is(
  aad_schema.user(
    sign(
      '{"username":"guest@aad.com","role":"guest"}'::json,'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG'),
      1
    ),
    '{"id":1,"first":"guest","last":"guest","email":"guest@aad.com"}',
    'select guest@aad.com'
  );

  -- SELECT
  -- user(TEXT, int )
  SELECT is(
    aad_schema.user(
      sign(
        '{"username":"example@aad.com","role":"editor"}'::json,'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG'),
        2
      ),
      '{"id":2,"first":"ex","last":"ample","email":"example@aad.com"}',
      'select example@aad.com'
    );

  -- UPDATE
  -- update users no password
  -- user(TEXT,int,TEXT,TEXT,TEXT)
  SELECT is(
    aad_schema.user(
      sign(
        '{"username":"example@aad.com","role":"editor"}'::json,'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG'),
         2,
         'ch',
         'ange',
         'change@gmail.com'
       ),
       '{"result":1}',
       'update example@aad.com to change@gmail.com'
     );


SELECT * FROM finish();
ROLLBACK;
------------
-- ./adopt-a-drain/adopt-a-drain-db/pg-database/db-scripts/compiled-scripts
------------

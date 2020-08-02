\c api_db
-------------------------------
-- INSERT
---------
-- credential(TEXT, TEXT)
CREATE OR REPLACE FUNCTION
api_schema.credential(username TEXT, password TEXT) RETURNS TEXT
AS $$
    Declare rc TEXT;
    Declare id int;
    Declare role TEXT;
  BEGIN
    rc := '{"result":-1}';
    role := 'editor';
    -- guest should be
    BEGIN
          INSERT INTO api_schema.users
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
api_schema.credential(token text, id int) RETURNS TEXT
AS $$
  DECLARE rc TEXT;
  DECLARE secret TEXT;
BEGIN
  -- returns a single user's info
  -- need to figure out postgres environment variables
  secret := 'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG';

  rc := '{"result":-1}';

  if api_schema.is_valid_token(token) then
    select
    '{"id":' || usr_id || ',"email":"' || usr_email || '"}'
    into rc from
    api_schema.users
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
api_schema.credential(token TEXT, username TEXT, password TEXT) RETURNS TEXT
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
  if api_schema.is_valid_token(token, 'guest') then
    SELECT '{"username":"' || usr_email || '","role":"' || usr_role || '"}'
      into payload FROM api_schema.users
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
api_schema.credential(token text, id int, email text, password text) RETURNS TEXT
AS $$
    Declare rc TEXT;
  BEGIN
    rc := '{"result":-1}';
    rc := format('{"result":%s}', id);
    if api_schema.is_valid_token(token, 'editor') then
      rc := '{"result":-2}';
      update api_schema.users
        set
          usr_email=email,
          usr_password=crypt(password, gen_salt('bf', 8))
        where usr_id=id
        and usr_email=api_schema.get_username(token);
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

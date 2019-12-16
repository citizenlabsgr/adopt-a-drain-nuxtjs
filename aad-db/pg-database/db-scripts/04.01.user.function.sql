\c api_db
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
api_schema.user(token TEXT, first text, last text, email text, password text) RETURNS TEXT
AS $$
    Declare rc TEXT;
    Declare role TEXT;
    Declare id int;
  BEGIN
    rc := '{"result",-1}';
    role := api_schema.get_role(token);
    BEGIN
      if api_schema.is_valid_token(token,'guest') then
        rc := '{"result",-2}';
        INSERT INTO api_schema.users
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
api_schema.user(token text, id int) RETURNS TEXT
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
    '{"id":' || usr_id || ',"first":"' || usr_first_name || '","last":"' || usr_last_name || '","email":"' || usr_email || '"}'
    into rc from
    api_schema.users
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
api_schema.user(token text, first text, last text, email text, password text) RETURNS TEXT
AS $$
    Declare rc TEXT;
    Declare role TEXT;
  BEGIN
    rc := '{"result":-1}';
    BEGIN
      if api_schema.is_valid_token(token) then
        rc := '{"result":-2}';
        if id < 0 THEN
          role := 'editor';
          INSERT INTO api_schema.users
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
api_schema.user(token text, id int, first text, last text, email text) RETURNS TEXT
AS $$
    Declare rc TEXT;
  BEGIN
    rc := '{"result":-1}';
    if api_schema.is_valid_token(token, 'editor') then
      rc := '{"result":-2}';
      rc := format('{"result":"%s"}',api_schema.get_username(token));
      update api_schema.users
        set
          usr_first_name=first,
          usr_last_name=last,
          usr_email=email
        where usr_id=id
          and usr_email=api_schema.get_username(token);
      if FOUND then
        rc := '{"result":1}';
      end if;
    end if;
    RETURN rc;
  END;
$$ LANGUAGE plpgsql;

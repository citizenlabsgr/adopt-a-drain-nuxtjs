\c api_db
----------------------------------------------
CREATE OR REPLACE FUNCTION
api_schema.get_username(token text) RETURNS TEXT
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

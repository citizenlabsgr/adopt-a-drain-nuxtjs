\c api_db
---------------------------------------------
CREATE OR REPLACE FUNCTION
api_schema.is_valid_token(token text) RETURNS Boolean
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
api_schema.is_valid_token(token TEXT, role TEXT) RETURNS Boolean
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

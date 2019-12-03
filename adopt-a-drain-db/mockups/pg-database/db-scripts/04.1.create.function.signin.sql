\c api_db
-- ref: https://github.com/PostgREST/postgrest/issues/783
-- ref: https://dba.stackexchange.com/questions/52235/how-can-i-use-an-environment-variable-in-a-postgres-function
select '-- create.function.signin A';
CREATE OR REPLACE FUNCTION
api_schema.signin(username TEXT, password TEXT) RETURNS TEXT
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
  SELECT usr_id into last_id FROM api_schema.users
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

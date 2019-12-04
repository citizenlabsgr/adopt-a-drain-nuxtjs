\c api_db
select '-- create.function.signup A';
CREATE OR REPLACE FUNCTION
api_schema.signup(username text, password text) RETURNS VOID
AS $$
  INSERT INTO api_schema.users (usr_email, usr_pass, usr_role) VALUES
    (signup.username, crypt(signup.password, gen_salt('bf', 8)), 'editor');
$$ LANGUAGE sql;
select '-- create.function.signup out';

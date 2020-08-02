\c api_db

-- setup guest credential
DO $$
  DECLARE rc TEXT;
  DECLARE username TEXT;
  DECLARE password TEXT;
  DECLARE id int;
BEGIN
  username := 'guest@aad.com';
  password := 'a1A!aaaa';
  TRUNCATE TABLE api_schema.users;
  INSERT INTO api_schema.users
    (usr_first_name, usr_last_name, usr_email, usr_password, usr_role)
    VALUES
    ('guest', 'guest', username, crypt(password, gen_salt('bf', 8)), 'guest');
END $$ LANGUAGE plpgsql;

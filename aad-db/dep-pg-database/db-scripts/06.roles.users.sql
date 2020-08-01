\c api_db
---- SET DB
----\c dbname=adoptadrain
SELECT '-- role.users A';
CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'mysecretpassword';
CREATE ROLE guest;
CREATE ROLE anonymous;
CREATE ROLE editor;

SELECT '-- role.users E1';
GRANT USAGE ON SCHEMA api_schema TO anonymous;
GRANT USAGE ON SCHEMA api_schema TO guest;
GRANT USAGE ON SCHEMA api_schema TO editor;

GRANT anonymous, guest TO authenticator;

SELECT '-- role.users F';
GRANT SELECT, INSERT ON TABLE api_schema.users TO guest;

SELECT '-- role.users G';
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA api_schema to guest;

SELECT '-- role.users H';
GRANT SELECT, INSERT ON TABLE api_schema.users TO anonymous;

SELECT '-- role.users I';

GRANT EXECUTE ON FUNCTION
  api_schema.credential(TEXT, TEXT)
  TO anonymous;

GRANT EXECUTE ON FUNCTION
  api_schema.credential(TEXT, TEXT, TEXT)
  TO anonymous;
GRANT EXECUTE ON FUNCTION
  api_schema.credential(TEXT,int,TEXT,TEXT)
  TO anonymous;

GRANT EXECUTE ON FUNCTION
  api_schema.user(text, int)
  TO anonymous;
GRANT EXECUTE ON FUNCTION
  api_schema.user(TEXT,int,TEXT,TEXT,TEXT)
  TO anonymous;


GRANT EXECUTE ON FUNCTION
  api_schema.is_valid_token(text)
  TO anonymous;

SELECT '-- role.users OUT';

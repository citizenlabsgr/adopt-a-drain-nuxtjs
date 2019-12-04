\c api_db
---- SET DB
----\c dbname=adoptadrain
SELECT '-- role.users A';
CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'mysecretpassword';
CREATE ROLE guest;
CREATE ROLE anonymous;
SELECT '-- role.users E1';
GRANT USAGE ON SCHEMA api_schema TO anonymous;
GRANT USAGE ON SCHEMA api_schema TO guest;
GRANT anonymous, guest TO authenticator;
SELECT '-- role.users F';
GRANT SELECT, INSERT ON TABLE api_schema.users TO guest;
SELECT '-- role.users G';
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA api_schema to guest;
SELECT '-- role.users H';
GRANT SELECT, INSERT ON TABLE api_schema.users TO anonymous;
SELECT '-- role.users I';
GRANT EXECUTE ON FUNCTION
  api_schema.signup(text, text)
  TO anonymous;
GRANT EXECUTE ON FUNCTION
  api_schema.signin(text, text)
  TO anonymous;
SELECT '-- role.users OUT';

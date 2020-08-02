--postgres=# \l
\c postgres
DROP DATABASE IF EXISTS api_db;
CREATE DATABASE api_db;
-- SET DB
\c api_db
select '-- create.api.A';
create schema if not exists api_schema;
select '-- create.api.B';
create extension IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pgtap;
CREATE EXTENSION IF NOT EXISTS pgjwt;
select '-- create.api.C';
SET search_path TO api_schema, public; -- put everything in api_schema;
select '-- create.api.OUT';

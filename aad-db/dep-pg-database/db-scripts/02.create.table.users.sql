---- SET DB
\c api_db
select '-- create.table.users A';
create table if not exists
api_schema.users (
  usr_id SERIAL PRIMARY KEY,
  usr_email text check ( usr_email ~* '^.+@.+\..+$' ),
  usr_password text not null check (length(usr_password) < 512),
  usr_first_name character varying,
	usr_last_name character varying,
  usr_role text not null check (length(usr_role) < 512),
  usr_active BOOLEAN NOT NULL DEFAULT true
);
select '-- create.table.users B';
CREATE UNIQUE INDEX IF NOT EXISTS users_usr_id_pkey ON api_schema.users(usr_id int4_ops);
select '-- create.table.users C';
CREATE UNIQUE INDEX IF NOT EXISTS index_users_on_usr_email ON api_schema.users(usr_email text_ops);
select '-- create.table.users out';

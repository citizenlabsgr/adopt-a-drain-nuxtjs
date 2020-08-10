\c aad_db
--------------
-- Environment
--------------

-- TODO ?.?.?: When adopter is deactivated then deactivate all adoptions by that adopter
-- TODO ?.?.?: test for active adopter record during signin. When active is false then adopter is the same as deleted.

-- DONE 1.2.0: Add Adpotee
-- DONE 1.2.0: Rename schema from aad_schema_1_2_0 to aad_version_1_2_0

/*
\set postgres_jwt_secret `echo "'$POSTGRES_JWT_SECRET'"`
\set lb_guest_password `echo "'$LB_GUEST_PASSWORD'"`
\set lb_woden `echo "'$LB_WODEN'"`

select :lb_guest_password as lb_guest_password;
select :postgres_jwt_secret as postgres_jwt_secret;
select :lb_woden as lb_woden, pg_typeof(:lb_woden::JSONB) as type;

--------------
-- DATABASE
--------------

-- DROP DATABASE IF EXISTS aad_db;
-- CREATE DATABASE aad_db;

---------------
-- Security, dont let users create anything in public
---------------
-- REVOKE CREATE ON SCHEMA public FROM PUBLIC;

--\c aad_db
---------------
-- SCHEMA: Create Schema
---------------
CREATE SCHEMA if not exists aad_version_1_2_0;

-- CREATE EXTENSION IF NOT EXISTS pgcrypto;;
-- CREATE EXTENSION IF NOT EXISTS pgtap;;
-- CREATE EXTENSION IF NOT EXISTS pgjwt;;
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-----------------
-- HOST variables
-----------------

--------------
-- DATABASE: Alter app.settings
--------------
ALTER DATABASE aad_db SET "app.settings.jwt_secret" TO :postgres_jwt_secret;

-- doenst work ALTER DATABASE aad_db SET "custom.authenticator_secret" TO 'mysecretpassword';
--------------
-- SETTINGS
--------------
-- settings are only available at runtime
-- settings are not avalable for use in this script

ALTER DATABASE aad_db SET "app.lb_woden" To :lb_woden;

ALTER DATABASE aad_db SET "app.lb_guest_aad" To '{"role":"guest_aad"}';

ALTER DATABASE aad_db SET "app.lb_editor_aad" To '{"role":"editor_aad", "key":"afoekey012345"}';


--Select current_setting('app.lb_woden', 't') as lb_woden, pg_typeof(current_setting('app.lb_woden')) as type;

--Select current_setting('app.lb_guest_aad','t') as lb_guest_aad, pg_typeof(current_setting('app.lb_guest_aad')) as type;

---------------
-- GRANT: Grant Schema Permissions
---------------
grant usage on schema aad_version_1_2_0 to guest_aad;
grant usage on schema aad_version_1_2_0 to editor_aad;
grant usage on schema aad_version_1_2_0 to process_logger_role;
---------------
-- SCHEMA: Set Schema Path
---------------

SET search_path TO aad_version_1_2_0, public;

----------------
-- TYPE: Create Types
----------------
CREATE TYPE aad_version_1_2_0.woden_token AS (
  woden text
);
CREATE TYPE aad_version_1_2_0.jwt_token AS (
  token text
);

--------------
-- TABLE: Create Table
--------------

create table if not exists
    aad_version_1_2_0.adopt_a_drain (
        reg_id TEXT PRIMARY KEY DEFAULT uuid_generate_v4 (),
        reg_type varchar(256) not null check (length(reg_type) < 256),
        reg_form jsonb not null,
        reg_active BOOLEAN NOT NULL DEFAULT true,
        reg_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        reg_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP
    );
----------------
-- INDEX: Create Index
-- * index automatically go in the parent table's schema
----------------
CREATE INDEX adopter_partial_idx ON aad_version_1_2_0.adopt_a_drain USING gin (reg_form) where reg_type = 'adopter';


-- GRANT: Grant Table Permissions
grant insert on aad_version_1_2_0.adopt_a_drain to guest_aad; -- C
grant select on aad_version_1_2_0.adopt_a_drain to guest_aad; -- R, signin

grant insert on aad_version_1_2_0.adopt_a_drain to editor_aad; -- C
grant update on aad_version_1_2_0.adopt_a_drain to editor_aad; -- U
grant select on aad_version_1_2_0.adopt_a_drain to editor_aad; -- R

grant insert on aad_version_1_2_0.adopt_a_drain to process_logger_role; -- C

----------------
-- FUNCTION: Table Trigger
----------------


CREATE OR REPLACE FUNCTION aad_version_1_2_0.adopt_a_drain_upsert_trigger_func() RETURNS TRIGGER
AS $$
Declare _token TEXT;
Declare _payload_claims JSON;
Declare _payload_claims_tmpl TEXT;
Declare _form JSONB;
Declare _pw TEXT;
BEGIN
    -- This trigger handles tokens for "app"
   -- create application token
   -- application specific login

    IF (TG_OP = 'INSERT') THEN
      IF (NEW.reg_form ->> 'type' = 'adopter' or NEW.reg_form ->> 'type' = 'owner' or NEW.reg_form ->> 'type' = 'woden') then
        -- covert id to lowercase
        --NEW.reg_name := LOWER(NEW.reg_form ->> 'name');
        -- encrypt password
        --_form := format('{"id":"%s", "password":"%s"}'::TEXT, NEW.reg_form ->> 'name', crypt(NEW.reg_form ->> 'password', gen_salt('bf')) )::JSONB;
        _form := format('{"id":"%s","key":"%s","name":"%s","password":"%s"}'::TEXT,LOWER(NEW.reg_form ->> 'name'), NEW.reg_id, NEW.reg_form ->> 'name', crypt(NEW.reg_form ->> 'password', gen_salt('bf')) )::JSONB;
        NEW.reg_id := LOWER(NEW.reg_form ->> 'name');
        NEW.reg_form := NEW.reg_form  || _form;
      ELSEIF (NEW.reg_form ->> 'type' = 'app') then
        -- create guest token for use by new app, similar to woden

        _payload_claims := format('{"iss":"%s", "sub":"%s", "role":"%s", "name":"%s", "type":"%s"}'::TEXT,
                                  current_setting('app.lb_woden')::JSONB ->> 'org',
                                  'application',
                                  'guest_aad',
                                  NEW.reg_form ->> 'app-name',
                                  'owner'
                                  )::JSON;

        _token := sign( _payload_claims, current_setting('app.settings.jwt_secret')::TEXT,  'HS256'::TEXT);
        _form := format('{"token": "%s"}',_token)::JSONB;
        -- overide id, id should be <name>@<verson> after templating
        -- convert id to lowercase
        NEW.reg_id := LOWER(NEW.reg_form ->> 'name');
        -- add token to form
        NEW.reg_form := NEW.reg_form || _form;
        -- encrypt password


      END IF;

    ELSEIF (TG_OP = 'UPDATE') THEN

       NEW.reg_updated := CURRENT_TIMESTAMP;

    END IF;

    RETURN NEW;
END; $$ LANGUAGE plpgsql;
-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_2_0.adopt_a_drain_upsert_trigger_func to guest_aad;
grant EXECUTE on FUNCTION aad_version_1_2_0.adopt_a_drain_upsert_trigger_func to editor_aad;


----------------
-- TRIGGER: Create Table Trigger
----------------
CREATE TRIGGER adopt_a_drain_ins_upd_trigger
 BEFORE INSERT ON aad_version_1_2_0.adopt_a_drain
 FOR EACH ROW
 EXECUTE PROCEDURE aad_version_1_2_0.adopt_a_drain_upsert_trigger_func();

grant TRIGGER on aad_version_1_2_0.adopt_a_drain to guest_aad;
grant TRIGGER on aad_version_1_2_0.adopt_a_drain to editor_aad;

-----------------
-- FUNCTION: Create process_logger(_form JSONB)
-----------------

CREATE OR REPLACE FUNCTION aad_version_1_2_0.process_logger(_form JSONB) RETURNS JSONB
AS $$
  Declare rc jsonb;
  Declare _model_user JSONB;
  --Declare _form JSONB;
  Declare _jwt_role TEXT;
  Declare _validation JSONB;
  Declare _password TEXT;

  BEGIN
    -- claims check
    -- confirm all required attributes are in form
    -- validate attribute values
    _validation := process_logger_validate(_form);
    if _validation ->> 'status' != '200' then
        return _validation;
    end if;

    if _form ? 'id' then
        return '{"status": "400", "msg": "Update not supported"}'::JSONB;
    else
      -- obfuscate the password before logging
      --_form := form::JSONB || '{"password":"sssssssssss"}'::JSONB;
      BEGIN
              INSERT INTO aad_version_1_2_0.adopt_a_drain
                  (reg_type, reg_form)
              VALUES
                  ('process', _form);
      EXCEPTION
          WHEN unique_violation THEN
              return '{"status":"400", "msg":"Bad Process Request, duplicate error"}'::JSONB;
          WHEN check_violation then
              return '{"status":"400", "msg":"Bad Process Request, validation error"}'::JSONB;
          WHEN others then
              return format('{"status":"500", "msg":"Unknown Process insertion error", "SQLSTATE":"%s"}',SQLSTATE)::JSONB;
      END;
    end if;

    rc := '{"msg": "OK", "status": "200"}'::JSONB;
    return rc;
  END;
$$ LANGUAGE plpgsql;
-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_2_0.process_logger(JSONB) to process_logger_role; -- upsert

-----------------
-- FUNCTION: Create process_logger_validate(form JSONB)
-----------------

CREATE OR REPLACE FUNCTION aad_version_1_2_0.process_logger_validate(form JSONB) RETURNS JSONB
AS $$

  BEGIN
    -- name, type, "group, owner, password
    -- name, type, app_id, password
    -- confirm all required attributes are in form
    -- process_logger's type can be  different from the form.type
    if not(form ? 'type' ) then
       return '{"status":"400","msg":"Bad Request, process_logger_validate is missing one or more form attributes"}'::JSONB;
    end if;

    return '{"status": "200"}'::JSONB;
  END;
$$ LANGUAGE plpgsql;
-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_2_0.process_logger_validate(JSONB) to process_logger_role; -- upsert


---------------------
-- GRANT: GRANT Schema permissions
---------------------
grant usage on schema aad_version_1_2_0 to process_logger_role;
-- GRANT: Grant Table permissions to process_logger_role
grant insert on aad_version_1_2_0.adopt_a_drain to process_logger_role; -- C ... 'app' only
grant select on aad_version_1_2_0.adopt_a_drain to process_logger_role; -- R ... 'owner', 'app'

-- TRIGGER
-- process_logger_role should inhert regi ster trigger privileges
-- GRANT: Grant Trigger Permissions to process_logger_role
grant EXECUTE on FUNCTION aad_version_1_2_0.adopt_a_drain_upsert_trigger_func to process_logger_role;

-----------------
-- FUNCTION: Create http_response(_status text, _msg text)
-----------------

CREATE OR REPLACE FUNCTION aad_version_1_2_0.http_response(_status text, _msg text) RETURNS JSON
AS $$
 SELECT
   row_to_json(r)
 FROM (
   SELECT
     _status as status,
     _msg as msg
 ) r;
$$ LANGUAGE sql;
-- GRANT: Grant Function Permissions
grant EXECUTE on FUNCTION aad_version_1_2_0.http_response(TEXT, TEXT) to guest_aad; -- C
grant EXECUTE on FUNCTION aad_version_1_2_0.http_response(TEXT, TEXT) to editor_aad; -- C

------------
-- FUNCTION: Create is_valid_token(_token TEXT, expected_role TEXT)
-----------------

CREATE OR REPLACE FUNCTION aad_version_1_2_0.is_valid_token(_token TEXT, expected_role TEXT) RETURNS Boolean
AS $$

  DECLARE good Boolean;
  DECLARE actual_role TEXT;

BEGIN
  -- does role in token match expected role
  -- use db parameter app.settings.jwt_secret
  -- process the token
  -- return true/false
  good:=false;

  select payload ->> 'role' as role into actual_role  from verify(_token, current_setting('app.settings.jwt_secret'));

  if expected_role = actual_role then
    good := true;
  end if;

  RETURN good;
END;  $$ LANGUAGE plpgsql;
-- GRANT: Grant Function Permissions
grant EXECUTE on FUNCTION aad_version_1_2_0.is_valid_token(TEXT, TEXT) to guest_aad; -- C
grant EXECUTE on FUNCTION aad_version_1_2_0.is_valid_token(TEXT, TEXT) to editor_aad; -- C

----------------
-- USER: Setup woden user
----------------
--insert into aad_version_1_2_0.adopt_a_drain (reg_type, reg_form) values ('woden', (:lb_woden::JSONB || '{"type":"woden", "roles":"woden,admin"}'::JSONB) );
insert into aad_version_1_2_0.adopt_a_drain (reg_type, reg_form) values ('woden', (:lb_woden::JSONB || '{"type":"woden", "roles":"woden,admin"}'::JSONB) );
--insert into aad_version_1_2_0.adopt_a_drain (reg_type, reg_form) values ('app', (format('{"name":"aad@1.0.0", "owners":"%s"}', :lb_woden::JSONB ->> 'name')::JSONB) );


-----------------
-- FUNCTION: Create app_validate(form JSONB)
-----------------

CREATE OR REPLACE FUNCTION aad_version_1_2_0.app_validate(form JSONB) RETURNS JSONB
AS $$

  BEGIN
    -- confirm all required attributes are in form
    if not(form ? 'name' and form ? 'owner_id' ) then
       return format('{"status":"400","msg":"Bad Request, missing one or more form attributes","form":%s}', form::TEXT)::JSONB;
    end if;
    -- validate attribute values
    if not(form ->> 'type' = 'app') then
       return '{"status":"400", "msg":"Bad Request type value."}'::JSONB;
    end if;

    if not( exists( select regexp_matches(form ->> 'name', '^[a-z][a-z_]+@[1-9]+\.[0-9]+\.[0-9]+') ) ) then
       return format('{"status":"400", "msg":"Bad Request, bad application name.", "name":"%s"}',form ->> 'name')::JSONB;
    end if;

    -- proper owner name ... email
    if not( exists( select regexp_matches(form ->> 'owner_id', '[a-z\-_0-9]+@[a-z]+\.[a-z]+') ) ) then
       return format('{"status":"400", "msg":"Bad Request, bad owner id.", "owner_id":"%s"}', form ->> 'owner_id')::JSONB;
    end if;

    return '{"status": "200"}'::JSONB;
  END;
$$ LANGUAGE plpgsql;
-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_2_0.app_validate(JSONB) to editor_aad;


-- FUNCTION
-----------------
-- FUNCTION: Create app(form JSON)
-----------------
-- inserts an application record into the system

CREATE OR REPLACE FUNCTION aad_version_1_2_0.app(form JSON) RETURNS JSONB
AS $$
  Declare rc jsonb;
  Declare _model_user JSONB;
  Declare _form JSONB;
  Declare _jwt_role TEXT;
  Declare _jwt_app TEXT;
  Declare _validation JSONB;

  BEGIN

    -- get request values
    _jwt_role := current_setting('request.jwt.claim.role','t');
    if _jwt_role is NULL then
      _jwt_role := 'editor_aad';
    end if;
    if _jwt_role != 'editor_aad' then
      _validation := format('{"status":"401", "msg":"Unauthorized Token", "jwt_role":"%s"}',_jwt_role)::JSONB;
      -- PERFORM aad_version_1_2_0.process_logger(_validation);
      return _validation;
    end if;
    -- type stamp form
    _form := form::JSONB || '{"type":"app"}'::JSONB;

    BEGIN
      _model_user := current_setting(format('app.lb_%s',_jwt_role))::jsonb;
    EXCEPTION
      WHEN others then
        _validation := format('{"status": "401", "msg":"Unauthorized Token", "jwt_role":"%s","model_role":%s}',_jwt_role,_model_user )::JSONB;
        -- PERFORM aad_version_1_2_0.process_logger(_validation);
        return _validation;
        ---- PERFORM aad_version_1_2_0.process_logger(format('{"status":"500", "msg":"Unknown APP", "SQLSTATE":"%s", "role":"%s"}',SQLSTATE, _jwt_role)::JSONB);
        --return format('{"status":"500", "msg":"Unknown APP", "SQLSTATE":"%s", "role":"%s"}',SQLSTATE, _jwt_role)::JSONB;
    END;

    --if not(_model_user ->> 'role' = _jwt_role) then
    --    return format('{"status": "401", "msg":"Unauthorized token", "jwt_role":"%s","model_role":%s}',_jwt_role,_model_user )::JSONB;
    -- end if;

    _validation := app_validate(_form);
    if _validation ->> 'status' != '200' then
      -- PERFORM aad_version_1_2_0.process_logger(_validation);
      return _validation;
    end if;

    BEGIN
            INSERT INTO aad_version_1_2_0.adopt_a_drain
                (reg_type, reg_form)
            VALUES
                ('app', _form );
    EXCEPTION
        WHEN unique_violation THEN
            _validation := '{"status":"400", "msg":"Bad App Request, duplicate error"}'::JSONB;
            -- PERFORM aad_version_1_2_0.process_logger(_validation);
            return _validation;
        WHEN check_violation then
            _validation :=  '{"status":"400", "msg":"Bad App Request, validation error"}'::JSONB;
            -- PERFORM aad_version_1_2_0.process_logger(_validation);
            return _validation;
        WHEN others then
            _validation :=  format('{"status":"500", "msg":"Unknown App insertion error", "SQLSTATE":"%s"}',SQLSTATE)::JSONB;
            -- PERFORM aad_version_1_2_0.process_logger(_validation);
            return _validation;
    END;

    rc := '{"msg": "OK", "status": "200"}'::JSONB;

    return rc;
  END;
$$ LANGUAGE plpgsql;
-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_2_0.app(JSON) to editor_aad; -- C

--------------------
-- FUNCTION: Create app(id TEXT)
--------------------
CREATE OR REPLACE FUNCTION aad_version_1_2_0.app(id TEXT) RETURNS JSONB
AS $$
  Select reg_form from aad_version_1_2_0.adopt_a_drain where reg_id=id and reg_type='app';
$$ LANGUAGE sql;
-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_2_0.app(TEXT) to editor_aad; -- C
-- GRANT: Grant authenticator more permissions
grant guest_aad to authenticator;
grant editor_aad to authenticator;

-----------------
-- FUNCTION: Create signin_validate(form JSONB)
-----------------

CREATE OR REPLACE FUNCTION aad_version_1_2_0.signin_validate(form JSONB) RETURNS JSONB
AS $$
  BEGIN
    -- confirm all required attributes are in form
    if not(form ? 'type' and form ? 'name' and form ? 'password') then
        return http_response('400', 'Bad Request, missing one or more form attributes.');
    end if;
    -- validate attribute values
    if not(form ->> 'type' = 'signin') then
        return http_response('400', 'Bad Request type value.');
    end if;
    -- proper password
    if not (exists(select regexp_matches(form ->> 'password', '^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$') )) then
        return http_response('400', 'Bad Request, bad password.');
    end if;
    -- proper name ... name
    if not( exists( select regexp_matches(form ->> 'name', '[a-z\-_0-9]+@[a-z]+\.[a-z]+') ) ) then
      return http_response('400', format('Bad Request, bad name.'));
    end if;

    return http_response('200', 'OK');
  END;
$$ LANGUAGE plpgsql;
-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_2_0.signin_validate(JSONB) to guest_aad; -- upsert


------------
-- FUNCTION: Create aad_version_1_2_0.signin(form JSON)
------------

CREATE OR REPLACE FUNCTION aad_version_1_2_0.signin(form JSON) RETURNS JSONB
AS $$
  -- make token to execute app(JSON)
  declare rc JSONB;
  declare signin_token TEXT;
  declare process_error JSONB;
  declare _form JSONB;
  Declare _jwt_role TEXT;
  Declare _model_user JSONB;
  Declare _validation JSONB;
  Declare _pw TEXT;
  DECLARE _fr JSONB;
  BEGIN
    -- claims check
    _jwt_role := current_setting('request.jwt.claim.role','t');
    if _jwt_role is NULL then
      -- needed for tapps testing only
      _jwt_role := 'guest_aad';
    end if;
    if not(_jwt_role = 'guest_aad') then
      _validation := '{"status":"401", "msg":"UnAuthorized"}'::JSONB;
      PERFORM aad_version_1_2_0.process_logger(_validation);
      return _validation;
    end if;

    _form := form::JSONB;
    -- force a type
    _form := _form || '{"type":"signin"}'::JSONB;
    -- name to lowercase
    --_form := _form || format('{"name":"%s"}', LOWER(_form ->> 'name'))::JSONB;
    -- evaluate the token
    _model_user := current_setting('app.lb_guest_aad')::jsonb;
    if not(_model_user ->> 'role' = _jwt_role) then
        _validation := http_response('401','UnauthorizeD');
        PERFORM aad_version_1_2_0.process_logger(_validation);
        return _validation;
    end if;
    --
    -- validate input form
    -- confirm all required attributes are in form
    -- validate attribute values
    _validation := signin_validate(_form);
    if _validation ->> 'status' != '200' then
        PERFORM aad_version_1_2_0.process_logger(_validation);
        return _validation;
    end if;

    -- remove password
    _pw := _form ->> 'password';
    _form := _form - 'password';
    -- validate name and password

    select reg_form - 'password' as form into _fr
    from aad_version_1_2_0.adopt_a_drain
    where
      reg_type IN ('adopter','woden')
      and reg_id = LOWER(_form ->> 'name')
      and reg_form ->> 'password' = crypt(_pw, reg_form ->> 'password');

    IF _fr is NULL THEN
      -- login failure
      _form := _form || '{"status":"404", "msg":"Not Found"}'::JSONB;
      PERFORM aad_version_1_2_0.process_logger(_form);
      return http_response('401',format('Unauthenticated (%s)', _form ->> 'name'));
    end if;

    -- make signin_token
    SELECT public.sign(
      row_to_json(r), current_setting('app.settings.jwt_secret')
    ) AS woden into signin_token
    FROM (
      SELECT
        current_setting('app.lb_woden')::JSONB ->> 'org' as iss,
        current_setting('app.lb_woden')::JSONB ->> 'app' as sub,
        _fr ->> 'id' as jti,
        _fr ->> 'key' as key,
        'editor_aad'::text as role,
        extract(epoch from now() + '5 minutes'::interval) :: integer as exp
    ) r;
    -- log success
    _validation := _form || '{"status":"200"}'::JSONB;

    PERFORM aad_version_1_2_0.process_logger(_validation);
    -- test for owner account
    -- wrap signin_token in JSON
    return (SELECT row_to_json(r) as result
      from (
        SELECT
        '200' as status,
        'OK' as msg,
        signin_token as token
      ) r
    );

  END;
$$ LANGUAGE plpgsql;-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_2_0.signin(JSON) to guest_aad; -- upsert


-----------------
-- FUNCTION: Create adopter(form JSON)
-----------------

CREATE OR REPLACE FUNCTION aad_version_1_2_0.adopter(form JSON) RETURNS JSONB
AS $$
  Declare rc jsonb;
  Declare _model_adopter JSONB;
  Declare _form JSONB;
  Declare _jwt_role TEXT;
  Declare _validation JSONB;
  Declare _password TEXT;

  BEGIN

    -- claims check
    _jwt_role := current_setting('request.jwt.claim.role','t');
    if _jwt_role is NULL then
      -- assume insert
      -- runs during tests only
      _jwt_role := 'guest_aad';
      if form::JSONB ? 'id' then
        _jwt_role := 'editor_aad';
      end if;

    end if;

    -- handle multiple tokens
    BEGIN
      _model_adopter := current_setting(format('app.lb_%s',_jwt_role))::jsonb;
    EXCEPTION
      WHEN others then
        -- PERFORM aad_version_1_2_0.process_logger(format('{"status":"500", "msg":"Unknown ", "SQLSTATE":"%s", "role":"%s"}',SQLSTATE, _jwt_role)::JSONB);
        return format('{"status":"500", "msg":"Unknown ", "SQLSTATE":"%s", "role":"%s"}',SQLSTATE, _jwt_role)::JSONB;
    END;
    -- in acceptable roles

    -- type stamp and convert to JSONB
    _form := form::JSONB || '{"type":"adopter"}'::JSONB;
    -- confirm all required attributes are in form
    -- validate attribute values
    _validation := adopter_validate(_form);
    if _validation ->> 'status' != '200' then
        -- PERFORM aad_version_1_2_0.process_logger(_validation);
        return _validation;
    end if;

    if _form ? 'id' then
      -- editor
        return '{"status": "400", "msg": "Update not YET supported"}'::JSONB;
    else
      -- guest role
      BEGIN
              INSERT INTO aad_version_1_2_0.adopt_a_drain
                  (reg_type, reg_form)
              VALUES
                  ('adopter', _form);
      EXCEPTION
          WHEN unique_violation THEN
              -- PERFORM aad_version_1_2_0.process_logger(_form || '{"status":"400", "msg":"Bad Request, duplicate adopter"}'::JSONB);
              return '{"status":"409", "msg":"Conflict, duplicate adopter"}'::JSONB;
          WHEN check_violation then
              ---- PERFORM process_logger();
              return '{"status":"406", "msg":"Bad adopter Request, validation error"}'::JSONB;
          WHEN others then
              ---- PERFORM process_logger();
              return format('{"status":"500", "msg":"Unknown adopter insertion error", "SQLSTATE":"%s", "form":%s}',SQLSTATE, _form)::JSONB;
      END;
    end if;

    rc := '{"msg": "OK", "status": "200"}'::JSONB;
    return rc;
  END;
$$ LANGUAGE plpgsql;
-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_2_0.adopter(JSON) to guest_aad; -- upsert
grant EXECUTE on FUNCTION aad_version_1_2_0.adopter(JSON) to editor_aad; -- upsert

-----------------
-- FUNCTION: Create adopter_validate(form JSONB)
-----------------
CREATE OR REPLACE FUNCTION aad_version_1_2_0.adopter_validate(form JSONB) RETURNS JSONB
AS $$

  BEGIN
    -- name, type, "group, adopter, password
    -- name, type, app_id, password
    -- confirm all required attributes are in form
    if not(form ? 'type' and form ? 'name' and form ? 'password') then
       return '{"status":"400","msg":"Bad Request, adopter is missing one or more form attributes"}'::JSONB;
    end if;
    -- validate attribute values
    if not(form ->> 'type' = 'adopter') then
       return '{"status":"400", "msg":"Bad Request type value."}'::JSONB;
    end if;

    -- proper password
    if not (exists(select regexp_matches(form ->> 'password', '^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$') )) then
       return '{"status":"400", "msg":"Bad Request password value."}'::JSONB;
    end if;
    -- proper name ... name
    if not( exists( select regexp_matches(form ->> 'name', '[a-z\-_0-9]+@[a-z]+\.[a-z]+') ) ) then
       return format('{"status":"400", "msg":"Bad Request name value."}')::JSONB;
    end if;

    return '{"status": "200", "msg":"OK"}'::JSONB;
  END;
$$ LANGUAGE plpgsql;
-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_2_0.adopter_validate(JSONB) to guest_aad; -- upsert
grant EXECUTE on FUNCTION aad_version_1_2_0.adopter_validate(JSONB) to editor_aad; -- upsert

-----------------
-- FUNCTION: Create adopter(id TEXT)
-----------------
-- convert ids to lowercase

CREATE OR REPLACE FUNCTION aad_version_1_2_0.adopter(id TEXT) RETURNS JSONB
AS $$
  Select reg_form-'password' as adopter from aad_version_1_2_0.adopt_a_drain where reg_id=id and reg_type='adopter';
$$ LANGUAGE sql;
-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_2_0.adopter(JSON) to editor_aad; -- select


-----------------
-- FUNCTION: Create adoptee_validate(form JSONB)
-----------------
/*
'{
  "type":"adoptee",
  "adoptee_id":"gr12345667",
  "lat":42.01,
  "lon":-84.01
 }'
*/
CREATE OR REPLACE FUNCTION aad_version_1_2_0.adoptee_validate(form JSONB) RETURNS JSONB
AS $$

  BEGIN
    -- confirm all required attributes are in form
    if not(form ? 'lat' and form ? 'lon' and form ? 'adoptee_id' and form ? 'adopter_key' ) then
       return format('{"status":"400","msg":"Bad Request, missing one or more form attributes","form":%s}', form::TEXT)::JSONB;
    end if;
    -- validate attribute values
    if not(form ->> 'type' = 'adoptee') then
       return '{"status":"400", "msg":"Bad Request type value."}'::JSONB;
    end if;

    return '{"status": "200"}'::JSONB;
  END;
$$ LANGUAGE plpgsql;
-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_2_0.adoptee_validate(JSONB) to editor_aad;

-----------------
-- FUNCTION: Create adoptee(form JSON)
-----------------
-- {"type":"adoptee", "drain_id":"gr12345667", "lat":42.01, "lon":-84.01}

CREATE OR REPLACE FUNCTION aad_version_1_2_0.adoptee(form JSON) RETURNS JSONB
AS $$
  Declare rc jsonb;
  Declare _model_user JSONB;
  Declare _form JSONB;
  Declare _jwt_role TEXT;
  Declare _jwt_adoptee TEXT;
  Declare _validation JSONB;
  Declare _user_key TEXT;

  BEGIN

    -- get request values
    _jwt_role := current_setting('request.jwt.claim.role','t');
    _user_key := current_setting('request.jwt.claim.key','t');
    if _jwt_role is NULL or _user_key is NULL then
      _jwt_role := 'editor_aad';
      _user_key := 'testkey1234567890';
    end if;
    --
    if _jwt_role != 'editor_aad' then
      _validation := format('{"status":"401", "msg":"Unauthorized Token", "jwt_role":"%s"}',_jwt_role)::JSONB;
      PERFORM aad_version_1_2_0.process_logger(_validation);
      return _validation;
    end if;
    -- type stamp form and user key
    _form := form::JSONB || format('{"type":"adoptee", "adopter_key":"%s"}', _user_key)::JSONB;

    BEGIN
      -- app.lb_editor_aad
      _model_user := current_setting(format('app.lb_%s',_jwt_role))::jsonb;
    EXCEPTION
      WHEN others then
        _validation := format('{"status": "401", "msg":"Unauthorized Token", "jwt_role":"%s","model_role":%s}',_jwt_role,_model_user )::JSONB;
        PERFORM aad_version_1_2_0.process_logger(_validation);
        return _validation;

    END;

    _validation := adoptee_validate(_form);
    if _validation ->> 'status' != '200' then
      PERFORM aad_version_1_2_0.process_logger(_validation);
      return _validation;
    end if;

    BEGIN
            INSERT INTO aad_version_1_2_0.adopt_a_drain
                (reg_type, reg_form)
            VALUES
                ('adoptee', _form );
    EXCEPTION
        WHEN unique_violation THEN
            _validation := '{"status":"400", "msg":"Bad adoptee Request, duplicate error"}'::JSONB;
            PERFORM aad_version_1_2_0.process_logger(_validation);
            return _validation;
        WHEN check_violation then
            _validation :=  '{"status":"400", "msg":"Bad adoptee Request, validation error"}'::JSONB;
            PERFORM aad_version_1_2_0.process_logger(_validation);
            return _validation;
        WHEN others then
            _validation :=  format('{"status":"500", "msg":"Unknown adoptee insertion error", "SQLSTATE":"%s"}',SQLSTATE)::JSONB;
            PERFORM aad_version_1_2_0.process_logger(_validation);
            return _validation;
    END;

    rc := '{"msg": "OK", "status": "200"}'::JSONB;

    return rc;
  END;
$$ LANGUAGE plpgsql;
-- GRANT: Grant Execute adoptee
grant EXECUTE on FUNCTION aad_version_1_2_0.adoptee(JSON) to editor_aad; -- C

--------------------
-- FUNCTION: Create adoptee(id TEXT)
--------------------
CREATE OR REPLACE FUNCTION aad_version_1_2_0.adoptee(id TEXT) RETURNS JSONB
AS $$
  Select reg_form from aad_version_1_2_0.adopt_a_drain where reg_id=id and reg_type='adoptee';
$$ LANGUAGE sql;

-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_2_0.adoptee(TEXT) to editor_aad; -- C
*/

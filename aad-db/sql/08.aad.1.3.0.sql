/*
\c aad_db
--------------
-- Environment
--------------

-- TODO ?.?.?: When adopter is deactivated then deactivate all adoptions by that adopter
-- TODO ?.?.?: test for active adopter record during signin. When active is false then adopter is the same as deleted.
-- TODO 1.2.1: Change "process" type to "event" type
-- TODO 1.2.1: Change Process_logger to event_logger
-- TODO 1.2.1: Change 1_2_1 to 1_3_0
-- DONE 1.2.1: Create add_base schema
-- DONE 1.2.1: Move adopt_a_drain table to aad_base schema
-- DONE 1.2.1: stop insert of duplicate adoptee
-- DONE 1.2.1: add reg_data to adopter insert
-- DONE 1.2.1: add reg_data to adoptee insert
-- DONE 1.2.1: add reg_ata to signin

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
CREATE SCHEMA if not exists aad_version_1_3_0;

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
grant usage on schema aad_base to guest_aad;
grant usage on schema aad_base to editor_aad;
grant usage on schema aad_base to event_logger_role;

grant usage on schema aad_version_1_3_0 to guest_aad;
grant usage on schema aad_version_1_3_0 to editor_aad;
grant usage on schema aad_version_1_3_0 to event_logger_role;



---------------
-- SCHEMA: Set Schema Path
---------------

SET search_path TO aad_version_1_3_0, aad_base, public;

----------------
-- TYPE: Create Types
----------------
CREATE TYPE aad_version_1_3_0.woden_token AS (
  woden text
);
CREATE TYPE aad_version_1_3_0.jwt_token AS (
  token text
);


------------
-- FUNCTION: Create aad_version_1_3_0.signin(form JSON)
------------

CREATE OR REPLACE FUNCTION aad_version_1_3_0.signin(form JSON) RETURNS JSONB
AS $$
  -- make token to execute app(JSON)
  declare rc JSONB;
  declare signin_token TEXT;
  declare event_error JSONB;
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
      _validation := '{"status":"PT401", "msg":"UnAuthorized","type":"signin"}'::JSONB;
      PERFORM aad_base.event_logger(_validation);
      RAISE sqlstate 'PT401' using
        message = 'Unauthorized',
        detail = 'signin',
        hint = 'Are you a hacker?';
    end if;

    _form := form::JSONB;
    -- force a type
    _form := _form || '{"type":"signin"}'::JSONB;
    -- name to lowercase
    --_form := _form || format('{"name":"%s"}', LOWER(_form ->> 'name'))::JSONB;
    -- evaluate the token
    _model_user := current_setting('app.lb_guest_aad')::jsonb;
    if not(_model_user ->> 'role' = _jwt_role) then
        _validation := '{"status":"PT401", "msg":"UnauthorizeD","type":"signin"}'::JSONB;
        --_validation := aad_base.http_response('401','UnauthorizeD');
        PERFORM aad_base.event_logger(_validation);
        RAISE sqlstate 'PT401' using
        message = 'Unauthorized',
          detail = 'signin',
          hint = 'Not what I expected?';
    end if;
    --
    -- validate input form
    -- confirm all required attributes are in form
    -- validate attribute values

    -- confirm all required attributes are in form
    if not(_form ? 'type' and _form ? 'name' and _form ? 'password') then
        -- return '{"status":"PT400", "msg":"Bad Request, missing one or more form attributes.","type":"signin"}'::JSONB;
        RAISE sqlstate 'PT400' using
          message = 'Bad Request',
          detail = 'signin',
          hint = 'Get your act together?';
    end if;

    -- remove password
    _pw := _form ->> 'password';
    _form := _form - 'password';
    -- validate name and password

    select reg_form - 'password' as form into _fr
    from aad_base.adopt_a_drain
    where
      reg_data IN ('adopter','woden')
      and reg_pk = LOWER(_form ->> 'name')
      and reg_form ->> 'password' = crypt(_pw, reg_form ->> 'password');

    IF _fr is NULL THEN
      -- login failure
      _validation :=  '{"status":"PT403", "msg":"Forbidden","type":"signin"}'::JSONB || _form;
      PERFORM aad_base.event_logger(_validation);
      RAISE sqlstate 'PT403' using
        message = 'Forbidden',
        detail = 'signin',
        hint = 'Have you signed up?';
      --return _validation;
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
    _validation := _form || '{"status":200}'::JSONB;

    PERFORM aad_base.event_logger(_validation);
    -- test for owner account
    -- wrap signin_token in JSON
    return (SELECT row_to_json(r) as result
      from (
        SELECT
        signin_token as token
      ) r
    );

  END;
$$ LANGUAGE plpgsql;-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_3_0.signin(JSON) to guest_aad;

-----------------
-- FUNCTION: Create adopter(form JSON)
-----------------

CREATE OR REPLACE FUNCTION aad_version_1_3_0.adopter(form JSON) RETURNS JSONB
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
        _validation := '{"status":"500", "msg":"Unknown ","type":"adopter"}'::JSONB;
        PERFORM aad_base.event_logger(_validation);
        RAISE sqlstate 'PT500' using
          message = 'Unknown',
          detail = 'adopter',
          hint = 'Something went sideways.';
    END;
    -- in acceptable roles

    -- type stamp and convert to JSONB
    _form := form::JSONB || '{"type":"adopter"}'::JSONB;
    -- confirm all required attributes are in form
    -- validate attribute values

    -- confirm all required attributes are in form
    if not(_form ? 'type' and _form ? 'name' and _form ? 'password') then
       -- return '{"status":"400","msg":"Bad Request, adopter is missing one or more form attributes","type":"adopter"}'::JSONB;
       RAISE sqlstate 'PT400' using
         message = 'Bad Request',
         detail = 'adopter',
         hint = 'Get your act together?';
    end if;

    -- proper password
    if not (exists(select regexp_matches(form ->> 'password', '^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$') )) then
       -- return '{"status":"400", "msg":"Bad Request password value.","type":"adopter"}'::JSONB;
       RAISE sqlstate 'PT400' using
         message = 'Bad Request',
         detail = 'adopter',
         hint = 'Have you forgotten your password?';
    end if;
    -- proper name ... name
    if not( exists( select regexp_matches(form ->> 'name', '[a-z\-_0-9]+@[a-z]+\.[a-z]+') ) ) then
       -- return '{"status":"400", "msg":"Bad Request name value.","type":"adopter"}'::JSONB;
       RAISE sqlstate 'PT400' using
         message = 'Bad Request',
         detail = 'adopter',
         hint = 'Expecting an email for your name.';
    end if;


    if _form ? 'id' then
      -- editor
        -- return '{"status": "400", "msg": "Update not YET supported","type":"adopter"}'::JSONB;
        RAISE sqlstate 'PT400' using
          message = 'Bad Request',
          detail = 'adopter',
          hint = 'Update not YET supported.';
    else
      -- guest role
      BEGIN
              INSERT INTO aad_base.adopt_a_drain
                  (reg_sk, reg_data, reg_form)
              VALUES
                  (_form ->> 'name', 'adopter', _form);
      EXCEPTION
          WHEN unique_violation THEN
              _validation := _form || '{"status":"409", "msg":"Conflict, duplicate adopter.","type":"adopter"}'::JSONB;
              _validation := _validation - 'password';
              PERFORM aad_base.event_logger(_validation);
              RAISE sqlstate 'PT409' using
                message = 'Conflict',
                detail = 'adopter duplicate',
                hint = 'You have been here before.';
              -- return _validation;
          WHEN check_violation then
              _validation := '{"status":"406", "msg":"Bad adopter Request, validation error","type":"adopter"}'::JSONB;
              PERFORM aad_base.event_logger(_validation);
              RAISE sqlstate 'PT406' using
                message = 'Bad Request',
                detail = 'adopter',
                hint = 'Are you passing correct data?';
          WHEN others then
              _validation := '{"status":"500", "msg":"Unknown adopter insertion error","type":"adopter"}'::JSONB;
              PERFORM aad_base.event_logger(_validation);
              RAISE sqlstate 'PT500' using
                message = 'Unidentified',
                detail = 'adopter',
                hint = 'Did not see that comming!';
      END;
    end if;

    -- rc := '{"msg": "OK", "status": "200"}'::JSONB;
    -- return rc;
    return (SELECT row_to_json(r) as result
      from (
        SELECT
        200 as status,
        'OK' as msg
      ) r
    );
  END;
$$ LANGUAGE plpgsql;
-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_3_0.adopter(JSON) to guest_aad; -- upsert
grant EXECUTE on FUNCTION aad_version_1_3_0.adopter(JSON) to editor_aad; -- upsert


-----------------
-- FUNCTION: Create adopter(id TEXT)
-----------------
-- convert ids to lowercase

CREATE OR REPLACE FUNCTION aad_version_1_3_0.adopter(id TEXT) RETURNS JSONB
AS $$
  Select reg_form-'password' as adopter from aad_base.adopt_a_drain  where reg_pk=id and reg_sk='adopter';
$$ LANGUAGE sql;
-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_3_0.adopter(TEXT) to editor_aad; -- select

-----------------
-- FUNCTION: Create adoptee(form JSON)
-----------------
-- {"type":"adoptee", "drain_id":"gr12345667", "lat":42.01, "lon":-84.01}

CREATE OR REPLACE FUNCTION aad_version_1_3_0.adoptee(form JSON) RETURNS JSONB
AS $$
  Declare rc jsonb;
  Declare _model_user JSONB;
  Declare _form JSONB;
  Declare _jwt_role TEXT;
  Declare _jwt_adoptee TEXT;
  Declare _validation JSONB;
  Declare _adopter_key TEXT;

  BEGIN

    -- get request values
    _jwt_role := current_setting('request.jwt.claim.role','t');
    _adopter_key := current_setting('request.jwt.claim.key','t');
    if _jwt_role is NULL or _adopter_key is NULL then
      _jwt_role := 'editor_aad';
      _adopter_key := 'testkey1234567890';
    end if;
    --
    if _jwt_role != 'editor_aad' then
      _validation := '{"status":"401", "msg":"Unauthorized Token", "type":"adoptee"}'::JSONB;
      PERFORM aad_base.event_logger(_validation);
      RAISE sqlstate 'PT401' using
        message = 'Unauthorized Token',
        detail = 'adoptee',
        hint = 'Not sure what to tell you. Try logging in again.';
    end if;
    -- type stamp form and user key
    _form := form::JSONB || format('{"type":"adoptee", "adopter_key":"%s"}', _adopter_key)::JSONB;

    BEGIN
      -- app.lb_editor_aad
      _model_user := current_setting(format('app.lb_%s',_jwt_role))::jsonb;
    EXCEPTION
      WHEN others then
        _validation := '{"status": "401", "msg":"Unauthorized Token", "type":"adoptee"}'::JSONB;
        PERFORM aad_base.event_logger(_validation);
        RAISE sqlstate 'PT401' using
          message = 'Unauthorized Token',
          detail = 'adoptee',
          hint = 'Try logging in again.';
    END;

    -- _validation := adoptee_validate(_form);
    -- if _validation ->> 'status' != '200' then
    --  PERFORM aad_base.event_logger(_validation);
    --  return _validation;
    -- end if;
    -- confirm all required attributes are in form
    if not(_form ? 'lat' and _form ? 'lon' and _form ? 'drain_id' and _form ? 'adopter_key' ) then
       _validation := '{"status":"400","msg":"Bad Request, missing one or more form attributes", "type":"adoptee"}'::JSONB;
       PERFORM aad_base.event_logger(_validation);
       RAISE sqlstate 'PT400' using
         message = 'Bad Request',
         detail = 'adoptee missing attribute(s).',
         hint = 'Your form is incomplete.';
    end if;

    BEGIN
            INSERT INTO aad_base.adopt_a_drain
                (reg_sk, reg_data, reg_form)
            VALUES
            (_form ->> 'drain_id', 'adoptee', _form );
    EXCEPTION
        WHEN unique_violation THEN
            _validation := '{"status":"409", "msg":"Conflict duplicate adoptee.", "type":"adoptee"}'::JSONB;
            PERFORM aad_base.event_logger(_validation);
            RAISE sqlstate 'PT409' using
              message = 'Conflict',
              detail = 'adoptee duplicate',
              hint = 'Cannot do this twice!';
        WHEN check_violation then
            _validation :=  '{"status":"400", "msg":"Bad adoptee Request, validation error", "type":"adoptee"}'::JSONB;
            PERFORM aad_base.event_logger(_validation);
            RAISE sqlstate 'PT400' using
              message = 'Bad Request',
              detail = 'adoptee',
              hint = 'Is your data formatted correctly?';
        WHEN others then
            _validation :=  format('{"status":"500", "msg":"Unknown adoptee insertion error", "type":"adoptee", "SQLSTATE":"%s"}',SQLSTATE)::JSONB;
            PERFORM aad_base.event_logger(_validation);
            RAISE sqlstate 'PT500' using
              message = 'Unidentified',
              detail = 'adoptee',
              hint = 'Did not see that comming!';
    END;

    -- rc := '{"msg": "OK", "status": "200"}'::JSONB;
    -- return rc;

    return (SELECT row_to_json(r) as result
      from (
        SELECT
        200 as status,
        'OK' as msg
      ) r
    );
  END;
$$ LANGUAGE plpgsql;
-- GRANT: Grant Execute adoptee
grant EXECUTE on FUNCTION aad_version_1_3_0.adoptee(JSON) to editor_aad; -- C

--------------------
-- FUNCTION: Create adoptee(id TEXT)
--------------------
CREATE OR REPLACE FUNCTION aad_version_1_3_0.adoptee(id TEXT) RETURNS JSONB
AS $$
  Select reg_form from aad_base.adopt_a_drain  where reg_pk=id and reg_sk='adoptee';
$$ LANGUAGE sql;

-- GRANT: Grant Execute
grant EXECUTE on FUNCTION aad_version_1_3_0.adoptee(TEXT) to editor_aad; -- C
*/

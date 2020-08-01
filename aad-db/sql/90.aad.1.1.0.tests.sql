
------------------------
-- TESTs
------------------------
\c aad_db;

SET search_path TO aad_schema_1_1_0, public;

BEGIN;

  SELECT plan(2);
  -- TEST: Test app Insert
  SELECT is (
    aad_schema_1_1_0.app('{
      "name": "my_app@1.0.0",
      "owner_id": "me@someplace.com"}'::JSON
    ),
    '{"msg": "OK", "status": "200"}'::JSONB,
    'app - insert test'::TEXT
  );

  -- TEST: Test app Select
  SELECT matches(
    aad_schema_1_1_0.app('my_app@1.0.0'::TEXT)::TEXT,
    '[a-zA-Z\.0-9_]+',
    'app - select from adopt_a_drain by id and check token'::TEXT
  );

  SELECT * FROM finish();

ROLLBACK;

-------------------
-- OWNER TESTs
-------------------

BEGIN;

  SELECT plan(3);
  -- TEST: Test owner Insert
  SELECT is (
    aad_schema_1_1_0.owner('{
      "name":  "me@someplace.com",
      "password": "a1A!aaaa"
      }'::JSON
    ),
    '{"msg": "OK", "status": "200"}'::JSONB,
    'owner - insert test'::TEXT
  );

  SELECT * FROM finish();

ROLLBACK;

--------------------
-- PROCESS_LOGGER Tests
--------------------

BEGIN;

  SELECT plan(3);
  -- TEST: Test process_logger Insert
  SELECT is (
    aad_schema_1_1_0.process_logger('{
      "type":"test",
      "name":"some stuff",
      "desc":"more stuff"
      }'::JSONB
    ),
    '{"msg": "OK", "status": "200"}'::JSONB,
    'process_logger - insert test'::TEXT
  );

  SELECT * FROM finish();

ROLLBACK;



-------------------
-- SIGNIN Tests
-------------------

BEGIN;

  SELECT plan(3);
  -- TEST: Test(a) owner Insert
  SELECT is (
    aad_schema_1_1_0.owner('{
      "name":  "me@someplace.com",
      "password": "a1A!aaaa"
      }'::JSON
    ),
    '{"msg": "OK", "status": "200"}'::JSONB,
    'owner - insert test'::TEXT
  );
  -- TEST: Test(b) signin Insert
SELECT ok (
  aad_schema_1_1_0.signin('{
    "name":  "me@someplace.com",
    "password": "a1A!aaaa"
    }'
  )::JSON ->> 'status' = '200','signin - insert'
);

  SELECT * FROM finish();

ROLLBACK;

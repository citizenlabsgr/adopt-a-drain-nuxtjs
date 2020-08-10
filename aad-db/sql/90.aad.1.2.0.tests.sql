/*
------------------------
-- TESTs
------------------------
\c aad_db;

SET search_path TO aad_version_1_2_0, public;
*/
/*
BEGIN;

  SELECT plan(2);
  -- TEST: Test app Insert
  SELECT is (
    aad_version_1_2_0.app('{
      "name": "my_app@1.0.0",
      "owner_id": "me@someplace.com"}'::JSON
    ),
    '{"msg": "OK", "status": "200"}'::JSONB,
    'app - insert test  1_2_0'::TEXT
  );

  -- TEST: Test app Select
  SELECT matches(
    aad_version_1_2_0.app('my_app@1.0.0'::TEXT)::TEXT,
    '[a-zA-Z\.0-9_]+',
    'app - select from adopt_a_drain by id and check token  1_2_0'::TEXT
  );

  SELECT * FROM finish();

ROLLBACK;
*/
-------------------
-- adopter TESTs
-------------------

--------------------
-- PROCESS_LOGGER Tests
--------------------
/*
BEGIN;

  SELECT plan(3);
  -- TEST: Test process_logger Insert
  SELECT is (
    aad_version_1_2_0.process_logger('{
      "type":"test",
      "name":"some stuff",
      "desc":"more stuff"
      }'::JSONB
    ),
    '{"msg": "OK", "status": "200"}'::JSONB,
    'process_logger - insert test  1_2_0'::TEXT
  );

  SELECT * FROM finish();

ROLLBACK;



-------------------
-- SIGNIN Tests
-------------------

BEGIN;

  SELECT plan(3);
  -- TEST: Test(a) adopter Insert
  SELECT is (
    aad_version_1_2_0.adopter('{
      "name":  "me@someplace.com",
      "password": "a1A!aaaa"
      }'::JSON
    ),
    '{"msg": "OK", "status": "200"}'::JSONB,
    'adopter - insert test 1_2_0'::TEXT
  );

  -- TEST: Test(b) signin Insert

SELECT ok (
  aad_version_1_2_0.signin('{
    "name":  "me@someplace.com",
    "password": "a1A!aaaa"
    }'
  )::JSON ->> 'status' = '200','signin - insert 1_2_0'
);


SELECT * FROM finish();

ROLLBACK;

-------------------
-- Adoptee TESTs
-------------------
BEGIN;

  SELECT plan(3);
  -- TEST: Test(a) adopter Insert
  SELECT is (
    aad_version_1_2_0.adopter('{
      "name":  "me@someplace.com",
      "password": "a1A!aaaa"
      }'::JSON
    ),
    '{"msg": "OK", "status": "200"}'::JSONB,
    'adopter - insert test 1_2_0'::TEXT
  );

  -- TEST: Test(b) signin Insert

SELECT ok (
  aad_version_1_2_0.signin('{
    "name":  "me@someplace.com",
    "password": "a1A!aaaa"
    }'
  )::JSON ->> 'status' = '200','signin - insert 1_2_0'
);

-- TEST: Test(a) adopter Insert
SELECT is (
  aad_version_1_2_0.adoptee( '{
    "type":"adoptee",
    "drain_id":"adopteeid12345667",
    "lat":42.01,
    "lon":-84.01}'::JSON
  ),
  '{"msg": "OK", "status": "200"}'::JSONB,
  'adopter - insert test 1_2_0'::TEXT
);
SELECT * FROM finish();

ROLLBACK;
*/

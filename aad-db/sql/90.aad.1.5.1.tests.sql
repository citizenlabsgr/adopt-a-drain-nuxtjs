/*
<event-form>
<adopter-form>
<signin-event-form>
<adoptee-form>

| desc | partition key | sort key | data | form |
| ---- | ------ | ------ | -------- | -------- |
*/
------------------------
-- TESTs
------------------------

\c aad_db;

SET search_path TO aad_version_1_5_1, public;

--------------------
-- EVENT_LOGGER Tests
--------------------

--| Generic event | <request.jwt.claim.jti> | 'event#<guid>' | <type> | <event-form> |
--| Map pan | guest or <request.jwt.claim.jti> | event#<guid> |	pan |
--| Map zoom in | guest or <request.jwt.claim.jti> | event#<guid>	| zoom+ |
--| Map zoom out | guest or <request.jwt.claim.jti> | event#<guid>	| zoom- |
--| Show terms of use | guest or <request.jwt.claim.jti> | event#<guid>	| tou |
--| Initiate forgot password | <request.jwt.claim.jti> | event#<guid>	| forgot |


BEGIN;

  SELECT plan(1);
  -- TEST: Test event_logger Insert
  SELECT is (
    aad_base.event_logger('{
      "type":"test",
      "name":"some stuff",
      "desc":"more stuff"
      }'::JSONB
    ),
    '{"msg": "OK", "status": "200"}'::JSONB,
    'event_logger - insert test  1_5_1'::TEXT
  );

  SELECT * FROM finish();

ROLLBACK;


-------------------
-- Adopter TESTs
-------------------

--| add adopter  | <request.jwt.claim.jti> | 'profile#<request.jwt.claim.jti>' | <type> | <adopter-form> |

BEGIN;

  SELECT plan(2);
  -- TEST: Test(a) adopter Insert

  SELECT ok (
    aad_version_1_5_1.adopter('{
      "name":  "me@someplace.com",
      "password": "a1A!aaaa"
      }'::JSON
    )::JSONB ->> 'status' = '200','adopter - new adopter 1_5_1'
  );

  -- duplicate adopter
-- PREPARE duplicate_adopter AS aad_version_1_5_1.adopter('{"name":  "me@someplace.com", "password": "a1A!aaaa"}'::JSON);
PREPARE new_adopter as select aad_version_1_5_1.adopter('{"name":  "me@someplace.com", "password": "a1A!aaaa"}'::JSON);

SELECT throws_ok(
    'new_adopter',
    'PT409',
    'Conflict',
    'We should get a unique violation for a duplicate PK'
);

--Adpotees needs a test ... unable to get one working for function's return type


SELECT * FROM finish();

ROLLBACK;

-------------------
-- SIGNIN Tests
-------------------

BEGIN;

  SELECT plan(2);
  -- Add an adopter to test the signin
  SELECT is (
    aad_version_1_5_1.adopter('{
      "name":  "me@someplace.com",
      "password": "a1A!aaaa"
      }'::JSON
    ),
    '{"msg": "OK", "status": 200}'::JSONB,
    'adopter - insert 200 1_5_1'::TEXT
  );

-- TEST: Test(b) signin Insert

--| signin sucess | <guest> | 'event#<guid>' | 'signin' | <signin-form> |

SELECT ok (
  aad_version_1_5_1.signin('{
    "name":  "me@someplace.com",
    "password": "a1A!aaaa"
    }'
  )::JSONB ? 'token','signin - 200 insert 1_5_1'
);


SELECT * FROM finish();

ROLLBACK;


-------------------
-- Adoptee TESTs
-------------------

BEGIN;

  SELECT plan(5);

-- TEST: Test(a) adopter Insert

--| adoptee success | <request.jwt.claim.jti> | 'adoptee#<dr-asset-id>' | 'adoptee' | <adoptee-form> |
-- INSERT
SELECT is (
  aad_version_1_5_1.adoptee( '{
    "name":"some opt name",
    "drain_id":"GR_40089457",
    "lat":42.96265175640001,
    "lon":-85.6676956307}'::JSON
  ),
  '{"msg": "OK", "status": 200}'::JSONB,
  'adoptee - insert test 1_5_1'::TEXT
);
-- '{"name":"some opt name", "drain_id":"GR_40089457","lat":42.96265175640001,"lon":-85.6676956307}'
-- DUPLICATE
PREPARE new_adoptee AS select aad_version_1_5_1.adoptee( '{
  "name":"some opt name",
  "drain_id":"GR_40089457",
  "lat":42.96265175640001,
  "lon":-85.6676956307}'::JSON
);
SELECT throws_ok(
    'new_adoptee',
    'PT409',
    'Conflict',
    'We should get a unique violation for a duplicate PK'
);
-- UPDATE
SELECT is (
  aad_version_1_5_1.adoptee( 'GR_40089457', '{
    "id":"GR_40089457",
    "name":"some opt name",
    "drain_id":"GR_40089457",
    "lat":42.96265175640001,
    "lon":-85.6676956307}'::JSON
  ),
  '{"msg": "OK", "status": 200}'::JSONB,
  'adoptee - insert test 1_5_1'::TEXT
);

SELECT * FROM finish();

ROLLBACK;

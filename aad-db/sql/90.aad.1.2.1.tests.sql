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
/*
\c aad_db;

SET search_path TO aad_version_1_2_1, public;
*/
--------------------
-- EVENT_LOGGER Tests
--------------------
/*
| Generic event | <request.jwt.claim.jti> | 'event#<guid>' | <type> | <event-form> |
| Map pan | guest or <request.jwt.claim.jti> | event#<guid> |	pan |
| Map zoom in | guest or <request.jwt.claim.jti> | event#<guid>	| zoom+ |
| Map zoom out | guest or <request.jwt.claim.jti> | event#<guid>	| zoom- |
| Show terms of use | guest or <request.jwt.claim.jti> | event#<guid>	| tou |
| Initiate forgot password | <request.jwt.claim.jti> | event#<guid>	| forgot |
*/
/*
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
    'event_logger - insert test  1_2_1'::TEXT
  );

  SELECT * FROM finish();

ROLLBACK;
*/

-------------------
-- Adopter TESTs
-------------------
/*
| add adopter  | <request.jwt.claim.jti> | 'profile#<request.jwt.claim.jti>' | <type> | <adopter-form> |
*/
/*
BEGIN;

  SELECT plan(2);
  -- TEST: Test(a) adopter Insert
  SELECT is (
    aad_version_1_2_1.adopter('{
      "name":  "me@someplace.com",
      "password": "a1A!aaaa"
      }'::JSON
    ),
    '{"msg": "OK", "status": "200"}'::JSONB,
    'adopter - insert test 1_2_1'::TEXT
  );
  -- duplicate adopter
  SELECT ok (
    aad_version_1_2_1.adopter('{
      "name":  "me@someplace.com",
      "password": "a1A!aaaa"
      }'::JSON
    )::JSONB ->> 'status' = '409','adopter - 409 duplicate 1_2_1'
  );


SELECT * FROM finish();

ROLLBACK;
*/
-------------------
-- SIGNIN Tests
-------------------
/*

*/
/*
BEGIN;

  SELECT plan(2);
  -- Add an adopter to test the signin
  SELECT is (
    aad_version_1_2_1.adopter('{
      "name":  "me@someplace.com",
      "password": "a1A!aaaa"
      }'::JSON
    ),
    '{"msg": "OK", "status": "200"}'::JSONB,
    'adopter - insert 200 1_2_1'::TEXT
  );
*/
-- TEST: Test(b) signin Insert
/*
| signin sucess | <guest> | 'event#<guid>' | 'signin' | <signin-form> |
*/
/*
SELECT ok (
  aad_version_1_2_1.signin('{
    "name":  "me@someplace.com",
    "password": "a1A!aaaa"
    }'
  )::JSON ->> 'status' = '200','signin - 200 insert 1_2_1'
);


SELECT * FROM finish();

ROLLBACK;
*/

-------------------
-- Adoptee TESTs
-------------------
/*
BEGIN;

  SELECT plan(2);
*/
-- TEST: Test(a) adopter Insert
/*drain is {
 "dr_asset_id":"",
 "dr_discharge":"",
 "dr_jurisdiction":"",
 "dr_lat":"",
 "dr_lon":"",
 "dr_location":"",
 "dr_owner":"",
 "dr_subtype":"",
 "dr_subwatershed":"",
 "dr_type":""}

*/
/*
| adoptee success | <request.jwt.claim.jti> | 'adoptee#<dr-asset-id>' | 'adoptee' | <adoptee-form> |
*/
/*
SELECT is (
  aad_version_1_2_1.adoptee( '{
    "type":"adoptee",
    "drain_id":"GR12345",
    "lat":42.01,
    "lon":-84.01}'::JSON
  ),
  '{"msg": "OK", "status": "200"}'::JSONB,
  'adoptee - insert test 1_2_1'::TEXT
);
SELECT is (
  aad_version_1_2_1.adoptee( '{
    "type":"adoptee",
    "drain_id":"GR12345",
    "lat":42.01,
    "lon":-84.01}'::JSON
  ),
  '{"msg": "Conflict duplicate adoptee.", "type": "adoptee", "status": "409"}'::JSONB,
  'adoptee - insert test 1_2_1'::TEXT
);


SELECT * FROM finish();

ROLLBACK;
*/

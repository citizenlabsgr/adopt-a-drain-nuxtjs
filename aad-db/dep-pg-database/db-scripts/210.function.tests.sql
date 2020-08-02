\c api_db

select '##### Credential TESTS';
BEGIN;
SELECT plan(7);


--SELECT
-- credential(TEXT,TEXT)
SELECT is(
  api_schema.credential(
    sign(
      '{"username":"guest@aad.com","role":"guest"}'::json,'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG'
    ),
    'noxample@aad.com',
    'a1A!aaaa'
  ),
  '{"result":-1}',
  'credential noxample@aad.com not found SELECT');

-- UPDATE
-- update credential
-- credential(TEXT, int, TEXT,TEXT)

SELECT is(
  api_schema.credential(
    sign('{"username":"guest@aad.com","role":"guest"}'::json,'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG'),
    1,
    'guest@aad.com',
    'a1A!aaaa'
  ),
  '{"result":1}',
  'Credential guest@aad.com UPDATE'
);

------------------------------- USER
select '##### User TESTS';
-- INSERT
-- signup credential insert
-- credential(TEXT, TEXT)
SELECT is(
  api_schema.user(
    sign(
      '{"username":"guest@aad.com","role":"guest"}'::json,'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG'
    ),
    'ex',
    'ample',
    'example@aad.com',
    'a1A!aaaa'
  ),
  '{"result":1}',
  'example@aad.com credential INSERT'
);

  -- SELECT
  -- user(TEXT, int )
SELECT is(
  api_schema.user(
    sign(
      '{"username":"guest@aad.com","role":"guest"}'::json,'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG'),
      1
    ),
    '{"id":1,"first":"guest","last":"guest","email":"guest@aad.com"}',
    'select guest@aad.com'
  );

  -- SELECT
  -- user(TEXT, int )
  SELECT is(
    api_schema.user(
      sign(
        '{"username":"example@aad.com","role":"editor"}'::json,'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG'),
        2
      ),
      '{"id":2,"first":"ex","last":"ample","email":"example@aad.com"}',
      'select example@aad.com'
    );

  -- UPDATE
  -- update users no password
  -- user(TEXT,int,TEXT,TEXT,TEXT)
  SELECT is(
    api_schema.user(
      sign(
        '{"username":"example@aad.com","role":"editor"}'::json,'PASSWORD.must.BE.AT.LEAST.32.CHARS.LONG'),
         2,
         'ch',
         'ange',
         'change@gmail.com'
       ),
       '{"result":1}',
       'update example@aad.com to change@gmail.com'
     );


SELECT * FROM finish();
ROLLBACK;

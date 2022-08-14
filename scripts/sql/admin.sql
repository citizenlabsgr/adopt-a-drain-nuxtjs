/*
Using your favorite SQL client (eg Postico).
Logged in with Admin privileges
Run the following
*/

DO
$BODY$

  DECLARE claims_admin JSON :='{"aud":"citizenlabs-api",
                               "iss":"citizenlabs",
                               "sub":"client-api",
                               "user":"adopter@user.com",
                               "scope":"api_admin",
                               "key":"duckduckgoose"}';

  DECLARE owner OWNER_ID := '("duckduckgoose")'::OWNER_ID;



  DECLARE admin_token TOKEN :=  base_0_0_1.sign(claims_admin, base_0_0_1.get_jwt_secret())::TOKEN;

  DECLARE PK PRIMARYKEY := '("testpage","title")'::PRIMARYKEY;
  DECLARE form JSONB := '{}'::JSONB;
  DECLARE page_id TEXT := '' ;
  DECLARE name TEXT := '';
  DECLARE value TEXT := '';


BEGIN

    raise notice '---- About ';

	    page_id := 'about'::TEXT;
	    name := 'title'::TEXT;
	    value := 'About'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;

	    raise notice 'About %', api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


	    name := 'subtitle'::TEXT;
	    value := 'We-are-concerned-citizens.'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;

	    raise notice 'About %', api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


	    name := 'list#0'::TEXT;
	    value := 'LGROW'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;

	    raise notice 'About %', api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


	    name := 'list#1'::TEXT;
	    value := 'CitizenLabs'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;

	    raise notice 'About %', api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);



	raise notice '---- Opportunity ';

	    -- Title
	    page_id := 'opportunity'::TEXT;

	    name := 'title'::TEXT;
	    value := 'Opportunity'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);

	    -- Subtitle

	    name := 'subtitle'::TEXT;
	    value := 'We care about what you want to do.'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);

	    -- Description

	    name := 'description'::TEXT;
	    value := 'Are you a programmer with Nuxtjs experience who wants to help improve and maintain the Adopt a Drain application? Dont be shy! We are always seeking assistance with the code! Get involved and follow our GitHub page.'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id,  api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);

	    -- List

	    name := 'list#0'::TEXT;
	    value := 'Beginners-and-Experts'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


	    name := 'list#1'::TEXT;
	    value := 'Coders'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


	    name := 'list#2'::TEXT;
	    value := 'Domain-Experts'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


	    name := 'list#3'::TEXT;
	    value := 'Designers'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


		name := 'list#4'::TEXT;
	    value := 'Developers'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


	    name := 'list#5'::TEXT;
	    value := 'Hackers'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


	    name := 'list#6'::TEXT;
	    value := 'Speakers'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


	    name := 'list#7'::TEXT;
	    value := 'Teachers'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


	    name := 'list#8'::TEXT;
	    value := 'Testers'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


	    name := 'list#9'::TEXT;
	    value := 'Writers'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


	raise notice '---- Sign-Up ';

	    -- Title
	    page_id := 'adopter'::TEXT;

	    name := 'title'::TEXT;
	    value := 'Sign-Up'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);

	    -- Subtitle

	    name := 'subtitle'::TEXT;
	    value := 'Because, because, because'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);

	    -- Description

	    name := 'description'::TEXT;
	    value := 'Getting to know you'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id,  api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);




	raise notice '---- Sponsor ';

	    -- Title
	    page_id := 'sponsor'::TEXT;

	    name := 'title'::TEXT;
	    value := 'Sponsor'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);

	    -- Subtitle

	    name := 'subtitle'::TEXT;
	    value := 'We cannot do this alone'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);

	    -- Description

	    name := 'description'::TEXT;
	    value := 'Thank You'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id,  api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


	    -- List

	    name := 'list#0'::TEXT;
	    value := 'Lower-Grand-River-Organization-of-Watersheds'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);

	    name := 'list#1'::TEXT;
	    value := 'CitizenLabs'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);


	raise notice '---- Stats ';

	    -- Title
	    page_id := 'stats'::TEXT;

	    name := 'title'::TEXT;
	    value := 'Stats'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);

	    -- Subtitle

	    name := 'subtitle'::TEXT;
	    value := 'How much do we care?'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);

	    -- Description

	    name := 'description'::TEXT;
	    value := 'Thank You'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id,  api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);

	    -- List

	    name := 'list#0'::TEXT;
	    value := 'Drain-Adopters'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);

	    name := 'list#1'::TEXT;
	    value := 'Adopted-Drains'::TEXT;
	    form := format('{"page_id": "%s", "name": "%s", "value": "%s"}',page_id,name,value)::JSONB;
	    raise notice '% %', page_id, api_0_0_1.page(admin_token, owner::OWNER_ID, form::JSONB);

	-- ROLLBACK;
END;


$BODY$;


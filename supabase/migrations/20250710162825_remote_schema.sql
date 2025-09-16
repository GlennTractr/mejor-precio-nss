

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE SCHEMA IF NOT EXISTS "matching";


ALTER SCHEMA "matching" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pgsodium";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "matching"."CrawlingResultStatus" AS ENUM (
    'todo',
    'done'
);


ALTER TYPE "matching"."CrawlingResultStatus" OWNER TO "postgres";


CREATE TYPE "public"."packaging_type" AS ENUM (
    'unit',
    'kilo',
    'litro'
);


ALTER TYPE "public"."packaging_type" OWNER TO "postgres";


CREATE TYPE "public"."shop" AS ENUM (
    'liverpool',
    'aurrera'
);


ALTER TYPE "public"."shop" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "matching"."call_open_router_api"("p_model" "text", "p_temperature" double precision, "p_prompt_system" "text", "p_prompt_user" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    response jsonb;
    api_url text := 'https://openrouter.ai/api/v1/chat/completions';
    api_key text;
    request_body jsonb;
BEGIN
    -- Retrieve the API key from the vault using the getSecret function
    SELECT getSecret('OPEN_ROUTER_API_KEY') INTO api_key;

    -- Construct the request body
    request_body := jsonb_build_object(
        'model', p_model,
        'temperature', p_temperature,
        'messages', jsonb_build_array(
            jsonb_build_object('role', 'system', 'content', p_prompt_system),
            jsonb_build_object('role', 'user', 'content', p_prompt_user)
        )
    );

    -- Perform the POST request
    response := pg_net.http_post(
        api_url,
        request_body::text,
        ARRAY[
            'Authorization: Bearer ' || api_key,
            'Content-Type: application/json'
        ]
    );

    -- Return the response
    RETURN response;
END;
$$;


ALTER FUNCTION "matching"."call_open_router_api"("p_model" "text", "p_temperature" double precision, "p_prompt_system" "text", "p_prompt_user" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "matching"."launchMatchingIntent"("matchingintentid" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    sourceRecord RECORD;
BEGIN
    -- Loop through each source in the pool of the given matching intent
    FOR sourceRecord IN
        SELECT ms.id
        FROM matching."MatchingSource" ms
        JOIN matching."MatchingIntent" mi ON ms.pool = mi.pool
        WHERE mi.id = matchingIntentId
    LOOP
        -- Insert a new MatchingSourceIntent for each source
        INSERT INTO matching."MatchingSourceIntent" (pool_intent, source)
        VALUES (matchingIntentId, sourceRecord.id);
    END LOOP;
END;
$$;


ALTER FUNCTION "matching"."launchMatchingIntent"("matchingintentid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "matching"."launchProcessMatchingInput"("p_matching_input_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    api_url text;
    api_key text;
    request_body jsonb;
BEGIN
    -- Retrieve the Supabase anon key from the vault
    SELECT getSecret('NEXT_PUBLIC_SUPABASE_ANON_KEY') INTO api_key;
    SELECT getSecret('NEXT_PUBLIC_SUPABASE_URL') INTO api_url;

    -- Construct the request body (you can customize this as needed)
    request_body := jsonb_build_object(
        'matchingSourceIntentId', p_matching_input_id
    );

    -- Perform the POST request
    PERFORM pg_net.http_post(
        api_url || '/functions/v1/matching-ia-process',
        request_body::text,
        ARRAY[
            'Authorization: Bearer ' || api_key,
            'Content-Type: application/json'
        ]
    );

    -- Optionally, you can update the status of the MatchingInput or log the action
    -- UPDATE matching."MatchingInput" SET status = 'processed' WHERE id = p_matching_input_id;
END;
$$;


ALTER FUNCTION "matching"."launchProcessMatchingInput"("p_matching_input_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "matching"."launchProcessing"("matching_source_intent_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    api_url text;
    api_key text;
    request_body jsonb;
BEGIN
    -- Update the status of MatchingInput to 'processing'
    UPDATE matching."MatchingInput"
    SET status = 'processing'
    WHERE source_intent = matching_source_intent_id;

    -- Retrieve the Supabase anon key from the vault
    SELECT vault."getSecret"('NEXT_PUBLIC_SUPABASE_ANON_KEY') INTO api_key;
    SELECT vault."getSecret"('NEXT_PUBLIC_SUPABASE_URL') INTO api_url;

    -- Construct the request body (you can customize this as needed)
    request_body := jsonb_build_object(
        'matchingSourceIntentId', matching_source_intent_id
    );

    -- Perform the POST request
    PERFORM net.http_post(
        url:=api_url || '/functions/v1/matching-ia-process',
        body:=request_body::jsonb,
        headers:=JSONB_BUILD_OBJECT(
            'Authorization', 'Bearer ' || api_key,
            'Content-Type', 'application/json'
        )
    );

END;
$$;


ALTER FUNCTION "matching"."launchProcessing"("matching_source_intent_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "matching"."launchSource"("matching_source_intent_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    matching_source_type text;
BEGIN
    SELECT ms.type
    INTO matching_source_type
    FROM matching."MatchingSourceIntent" msi
    JOIN matching."MatchingSource" ms ON msi.source = ms.id
    WHERE msi.id = matching_source_intent_id;

    -- Determine the base URL based on the matching source type
    IF matching_source_type = 'apify_actor' OR matching_source_type = 'apify_task' THEN
      PERFORM matching."launchSourceApify"(matching_source_intent_id);
    ELSE
      RAISE LOG 'Need to be implement: %', matching_source_type;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error launching source: %', SQLERRM;
END; $$;


ALTER FUNCTION "matching"."launchSource"("matching_source_intent_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "matching"."launchSourceApify"("matching_source_intent_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    apify_token text;
    supabase_token text;
    response jsonb;
    matching_source_id uuid;
    shop text;
    apify_id text;
    apify_input jsonb;
    matching_source_type text;
    base_url text;
BEGIN
    -- Retrieve the APIFY_TOKEN from the vault using the new function
    apify_token := "vault"."get_secret"('APIFY_TOKEN');
    supabase_token := "vault"."get_secret"('SUPABASE_TOKEN');

    -- Retrieve the MatchingSource associated with the MatchingSourceIntent
    SELECT ms.id, s.label, ms.metadata->'apify'->>'id' AS apify_id, 
           ms.metadata->'apify'->'input' AS apify_input, ms.type
    INTO matching_source_id, shop, apify_id, apify_input, matching_source_type
    FROM matching."MatchingSourceIntent" msi
    JOIN matching."MatchingSource" ms ON msi.source = ms.id
    JOIN public."Shop" as s ON s.id = ms.shop
    WHERE msi.id = matching_source_intent_id;

    -- Determine the base URL based on the matching source type
    IF matching_source_type = 'apify_actor' THEN
        base_url := 'https://api.apify.com/v2/acts/';
    ELSE
        base_url := 'https://api.apify.com/v2/actor-tasks/';
    END IF;

    -- Check if apify_task.id and apify_task.input are found
    IF apify_id IS NULL OR apify_input IS NULL THEN
        -- Update the status to 'error' if not found
        UPDATE matching."MatchingSourceIntent"
        SET status = 'error'
        WHERE id = matching_source_intent_id;
        RAISE LOG 'Status updated to error for MatchingSourceIntent ID: %', matching_source_intent_id;
        RETURN;
    END IF;

    -- Launch the HTTP request to Apify
    SELECT net.http_post(
        base_url || apify_id || '/runs',
        apify_input,
        JSONB_BUILD_OBJECT(
            'token',
            apify_token,
            'webhooks',
            ENCODE(
                CONVERT_TO(
                    JSONB_BUILD_ARRAY(
                        JSONB_BUILD_OBJECT(
                            'eventTypes',
                            ARRAY['ACTOR.RUN.SUCCEEDED'],
                            'requestUrl',
                            'https://whwcrtlcmddqjefvsjel.supabase.co/functions/v1/apify-discovery',
                            'payloadTemplate',
                            '{ "userId": {{userId}}, "createdAt": {{createdAt}}, "eventType": {{eventType}}, "eventData": {{eventData}}, "resource": {{resource}}, "parserFormat": "' || shop || '", "matchingIntentId": "' || matching_source_intent_id || '"}',
                            'headersTemplate',
                            '{"Authorization": "Bearer ' || supabase_token || '"}'
                        )
                    )::TEXT,
                    'utf8'
                ),
                'base64'
            )
        )::jsonb
    ) INTO response;

    -- Handle the response as needed
    RAISE LOG 'Response from Apify: %', response;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error launching source apify: %', SQLERRM;
END; $$;


ALTER FUNCTION "matching"."launchSourceApify"("matching_source_intent_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "matching"."search_crawling_results"("keywords" "text"[]) RETURNS TABLE("id" "uuid", "all_keywords" "text"[])
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT cr.id,
           ARRAY_AGG(DISTINCT crk.keyword) AS all_keywords
    FROM crawler."CrawlingResult" cr
    JOIN crawler."CrawlingResultKeyword" crk ON cr.id = crk.result
    GROUP BY cr.id
    HAVING SUM(
               (SELECT COUNT(*) 
                FROM unnest(keywords) AS k 
                WHERE crk.keyword ILIKE k)
            ) >= 
           array_length(keywords, 1);
END;
$$;


ALTER FUNCTION "matching"."search_crawling_results"("keywords" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "matching"."triggerLaunchMatchingIntent"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Call the launchMatchingIntent function with the new MatchingIntent's ID
    PERFORM matching."launchMatchingIntent"(NEW.id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION "matching"."triggerLaunchMatchingIntent"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "matching"."triggerLaunchProcessing"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF OLD.status <> 'processing' AND NEW.status = 'processing' THEN
        PERFORM matching."launchProcessing"(NEW.id);
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "matching"."triggerLaunchProcessing"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "matching"."triggerUpdateIntentStatus"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM matching."updateIntentStatus"(NEW.pool_intent);
    RETURN NEW;
END;
$$;


ALTER FUNCTION "matching"."triggerUpdateIntentStatus"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "matching"."trigger_launch_source"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Call the launchSource function with the new MatchingSourceIntent ID
    PERFORM matching."launchSource"(NEW.id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION "matching"."trigger_launch_source"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "matching"."updateIntentStatus"("matchingintentid" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    all_done boolean;
BEGIN
    -- Check if all MatchingSourceIntents related to the given MatchingIntent are done
    SELECT COUNT(*) = 0 INTO all_done
    FROM matching."MatchingSourceIntent"
    WHERE pool_intent = matchingIntentId AND status <> 'done';

    -- If all are done, update the MatchingIntent status to 'matching'
    IF all_done THEN
        UPDATE matching."MatchingIntent"
        SET status = 'matching'
        WHERE id = matchingIntentId;
    END IF;
END;
$$;


ALTER FUNCTION "matching"."updateIntentStatus"("matchingintentid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."launchApifyActor"("p_actor_id" "text", "p_body" "jsonb") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    token text;
BEGIN
    SELECT * INTO token 
    FROM "vault"."getSecret"('APIFY_TOKEN');

    RETURN (SELECT
        net.http_post(
            url := format('https://api.apify.com/v2/actor-tasks/%s/runs?token=%s', p_actor_id, token),
            body := p_body
        )
    );
END; $$;


ALTER FUNCTION "public"."launchApifyActor"("p_actor_id" "text", "p_body" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."launchCrawl"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    link_record RECORD;
    start_urls jsonb := '[]'::jsonb;  -- Initialize an empty JSONB array
    batch_size INT := 100;  -- Define the batch size
    url_count INT := 0;  -- Initialize URL count
    api_key TEXT;  -- Variable to hold the API key
BEGIN
    RAISE LOG 'Launch crawl';
    -- Retrieve the API key from the vault
    SELECT "vault"."get_secret"('OPEN_ROUTER_API_KEY') INTO api_key;

    -- Retrieve all links from ProductSellContext
    FOR link_record IN 
        SELECT link 
        FROM public."ProductSellContext"
    LOOP

        -- Append each link to the start_urls JSONB array
        start_urls := start_urls || jsonb_build_array(jsonb_build_object('url', link_record.link));
        url_count := url_count + 1;  -- Increment the URL count

        RAISE LOG 'Crawling URLS: %', start_urls;

        -- If we have collected enough URLs, call the Apify actor
        IF url_count >= batch_size THEN
            -- Call the Apify actor with the start_urls
            PERFORM public."launchApifyActor"(
                'kae3nn~apify-open-ai-scrapping-task',
                jsonb_build_object('startUrls', start_urls, 'openrouter_api_key', api_key)
            );

            RAISE LOG 'Crawling started with URLs: %', start_urls;

            -- Reset the start_urls array and URL count for the next batch
            start_urls := '[]'::jsonb;
            url_count := 0;
        END IF;
    END LOOP;

    -- If there are any remaining URLs after the loop, call the Apify actor one last time
    IF url_count > 0 THEN
        PERFORM public."launchApifyActor"(
            'kae3nn~apify-open-ai-scrapping-task',
            jsonb_build_object('startUrls', start_urls, 'openrouter_api_key', api_key)
        );

        RAISE LOG 'Crawling started with remaining URLs: %', start_urls;
    END IF;

END;
$$;


ALTER FUNCTION "public"."launchCrawl"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."setPrice"("p_link" "text", "p_price" real, "p_date" timestamp with time zone DEFAULT "now"()) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_sell_context uuid;
BEGIN
    -- Find the ProductSellContext by link
    SELECT id INTO v_sell_context
    FROM public."ProductSellContext"
    WHERE link = p_link;

    -- If the sell context exists, perform an upsert on ProductSellContextPrice
    IF v_sell_context IS NOT NULL THEN
        INSERT INTO public."ProductSellContextPrice" (sell_context, price, date, created_at)
        VALUES (v_sell_context, p_price, p_date, now())
        ON CONFLICT (sell_context, date) 
        DO UPDATE SET 
            price = CASE 
                        WHEN EXCLUDED.price < public."ProductSellContextPrice".price THEN EXCLUDED.price 
                        ELSE public."ProductSellContextPrice".price 
                    END,
            created_at = now();
    ELSE
        RAISE EXCEPTION 'ProductSellContext with link % not found', p_link;
    END IF;
END;
$$;


ALTER FUNCTION "public"."setPrice"("p_link" "text", "p_price" real, "p_date" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_product_sell_context_price"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN

    

    IF NEW.date 
=
 
CURRENT_DATE
 
THEN

        

        UPDATE public."ProductSellContext"
        
SET
 price 
=
 NEW.price
        
WHERE
 id 
=
 NEW.sell_context;
    
END
 IF;
    
RETURN
 
NEW
;
END
;
$$;


ALTER FUNCTION "public"."update_product_sell_context_price"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "matching"."MatchingInput" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "source_intent" "uuid" NOT NULL,
    "input_unparsed" "jsonb",
    "input_parsed" "jsonb" NOT NULL,
    "link" "text" NOT NULL,
    "status" "text" DEFAULT 'to-extract'::"text" NOT NULL,
    "data_extracted" "jsonb"
);


ALTER TABLE "matching"."MatchingInput" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "matching"."MatchingIntent" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "pool" "uuid" NOT NULL,
    "status" "text" DEFAULT 'in-progress'::"text" NOT NULL
);


ALTER TABLE "matching"."MatchingIntent" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "matching"."MatchingPool" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "category" "uuid",
    "prompt" "uuid"
);


ALTER TABLE "matching"."MatchingPool" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "matching"."MatchingSource" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "shop" "uuid" NOT NULL,
    "pool" "uuid" NOT NULL,
    "type" "text",
    "metadata" "jsonb",
    "label" "text" NOT NULL
);


ALTER TABLE "matching"."MatchingSource" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "matching"."MatchingSourceIntent" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "pool_intent" "uuid" NOT NULL,
    "source" "uuid" NOT NULL,
    "status" "text" DEFAULT 'searching'::"text" NOT NULL
);


ALTER TABLE "matching"."MatchingSourceIntent" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "matching"."ProcessIntent" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" "text" NOT NULL,
    "domain" "text" NOT NULL,
    "html" "text" NOT NULL,
    "source_type" "text" NOT NULL,
    "status" "text" DEFAULT 'to_process'::"text" NOT NULL,
    "result" "json",
    "target_url" "text",
    "source_url" "text" NOT NULL
);


ALTER TABLE "matching"."ProcessIntent" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "matching"."ProductToModerate" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "url" "text" NOT NULL,
    "title" "text",
    "description" "text",
    "category" "uuid",
    "brand" "uuid",
    "model" "uuid",
    "status" "text" DEFAULT 'to-moderate'::"text" NOT NULL,
    "quantity" real,
    "intent" "uuid" NOT NULL,
    "price" real NOT NULL,
    "shop" "uuid" NOT NULL,
    "image_url" "text"
);


ALTER TABLE "matching"."ProductToModerate" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "matching"."ProductToModerateSpecs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "product" "uuid" NOT NULL,
    "specs" "uuid" NOT NULL
);


ALTER TABLE "matching"."ProductToModerateSpecs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "matching"."PromptMetadata" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "label" "text" NOT NULL,
    "model" "text" NOT NULL,
    "prompt" "text" NOT NULL,
    "response_format" "jsonb" NOT NULL,
    "temperature" real DEFAULT '0'::real NOT NULL
);


ALTER TABLE "matching"."PromptMetadata" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Country" (
    "label" "text" NOT NULL
);


ALTER TABLE "public"."Country" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Dictionary" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" "text" NOT NULL,
    "source" "uuid" NOT NULL,
    "value" "text" NOT NULL
);


ALTER TABLE "public"."Dictionary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."File" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_public" boolean DEFAULT true NOT NULL,
    "file_bucket" "text" NOT NULL,
    "file_path" "text" NOT NULL
);


ALTER TABLE "public"."File" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Product" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "brand" "uuid" NOT NULL,
    "description" "text" NOT NULL,
    "type" "public"."packaging_type" NOT NULL,
    "price_variation" double precision DEFAULT '0'::double precision NOT NULL,
    "image" "uuid" NOT NULL,
    "model" "uuid" NOT NULL
);


ALTER TABLE "public"."Product" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ProductBrand" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "label" "text" NOT NULL
);


ALTER TABLE "public"."ProductBrand" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ProductBrandCategory" (
    "category" "uuid" NOT NULL,
    "brand" "uuid" NOT NULL
);


ALTER TABLE "public"."ProductBrandCategory" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ProductCategory" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "label" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "image_bucket" "text",
    "image_path" "text",
    "country" "text" NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."ProductCategory" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ProductModel" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "label" "text" NOT NULL,
    "brand" "uuid" NOT NULL,
    "category" "uuid"
);


ALTER TABLE "public"."ProductModel" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ProductModelCategory" (
    "category" "uuid" NOT NULL,
    "brand" "uuid" NOT NULL
);


ALTER TABLE "public"."ProductModelCategory" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ProductPackaging" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "quantity" double precision NOT NULL,
    "type" "public"."packaging_type" NOT NULL,
    "product" "uuid" NOT NULL,
    "image" "uuid" NOT NULL
);


ALTER TABLE "public"."ProductPackaging" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ProductSellContext" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "shop" "uuid" NOT NULL,
    "price" real NOT NULL,
    "link" "text" NOT NULL,
    "packaging" "uuid"
);


ALTER TABLE "public"."ProductSellContext" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ProductSellContextPrice" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "date" "date" NOT NULL,
    "sell_context" "uuid" NOT NULL,
    "price" real NOT NULL
);


ALTER TABLE "public"."ProductSellContextPrice" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ProductSpecs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "category" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "label" "text" NOT NULL
);


ALTER TABLE "public"."ProductSpecs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ProductSpecsMapping" (
    "product_id" "uuid" NOT NULL,
    "spec_id" "uuid" NOT NULL
);


ALTER TABLE "public"."ProductSpecsMapping" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Shop" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "label" "text" NOT NULL,
    "img_url" "text" NOT NULL
);


ALTER TABLE "public"."Shop" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ShopIdentifier" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "shop" "uuid" NOT NULL,
    "domain" "text" NOT NULL
);


ALTER TABLE "public"."ShopIdentifier" OWNER TO "postgres";


ALTER TABLE "public"."ShopIdentifier" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."ShopIdentifier_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."product_favory" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "product" "uuid" NOT NULL,
    "owner" "uuid" NOT NULL
);


ALTER TABLE "public"."product_favory" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."product_sell_context_view" AS
SELECT
    NULL::"uuid" AS "product_id",
    NULL::"uuid" AS "packaging_id",
    NULL::"uuid" AS "sell_context_id",
    NULL::real AS "price",
    NULL::double precision AS "quantity",
    NULL::double precision AS "price_per_unit",
    NULL::"uuid" AS "shop_id",
    NULL::"text" AS "shop_name";


ALTER TABLE "public"."product_sell_context_view" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."product_packaging_view" WITH ("security_invoker"='on') AS
 SELECT "product_sell_context_view"."packaging_id",
    "product_sell_context_view"."product_id",
    "min"("product_sell_context_view"."price_per_unit") AS "best_price_per_unit",
    "max"("product_sell_context_view"."price_per_unit") AS "max_price_per_unit",
    "array_agg"("product_sell_context_view"."price_per_unit") AS "price_list",
    "array_agg"("product_sell_context_view"."shop_name") AS "shop_names"
   FROM "public"."product_sell_context_view"
  GROUP BY "product_sell_context_view"."packaging_id", "product_sell_context_view"."product_id";


ALTER TABLE "public"."product_packaging_view" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."product_view" WITH ("security_invoker"='on') AS
 SELECT "pv2"."id",
    "pv2"."best_price_per_unit",
    "pv2"."max_price_per_unit",
    "pv2"."shop_names",
    "pv2"."price_list",
    "pv2"."specs",
    "p"."title",
    "regexp_replace"("lower"("public"."unaccent"("p"."title")), ' '::"text", '-'::"text", 'g'::"text") AS "product_slug",
    "pm"."label" AS "model",
    "pb"."label" AS "brand",
    "pc"."label" AS "category",
    "qt"."unit_label" AS "quantity_type",
    "f"."file_bucket" AS "main_image_bucket",
    "f"."file_path" AS "main_image_path",
    "regexp_replace"("lower"("public"."unaccent"("pc"."label")), ' '::"text", '-'::"text", 'g'::"text") AS "category_slug"
   FROM (((((( SELECT "pv"."id",
            "pv"."best_price_per_unit",
            "pv"."max_price_per_unit",
            "pv"."shop_names",
            "pv"."price_list",
            COALESCE("json_agg"("json_build_object"('label', "ps"."label", 'type', "ps"."type")) FILTER (WHERE ("ps"."label" IS NOT NULL)), '[]'::"json") AS "specs"
           FROM ((( SELECT "ppv"."product_id" AS "id",
                    "min"("ppv"."best_price_per_unit") AS "best_price_per_unit",
                    "max"("ppv"."max_price_per_unit") AS "max_price_per_unit",
                    "array_agg"(DISTINCT "shop_name"."shop_name") AS "shop_names",
                    "array_agg"(DISTINCT "inner_price_list"."inner_price_list") AS "price_list"
                   FROM (("public"."product_packaging_view" "ppv"
                     LEFT JOIN LATERAL "unnest"("ppv"."shop_names") "shop_name"("shop_name") ON (true))
                     LEFT JOIN LATERAL "unnest"("ppv"."price_list") "inner_price_list"("inner_price_list") ON (true))
                  GROUP BY "ppv"."product_id") "pv"
             LEFT JOIN "public"."ProductSpecsMapping" "psm" ON (("pv"."id" = "psm"."product_id")))
             LEFT JOIN "public"."ProductSpecs" "ps" ON (("psm"."spec_id" = "ps"."id")))
          GROUP BY "pv"."id", "pv"."best_price_per_unit", "pv"."max_price_per_unit", "pv"."shop_names", "pv"."price_list") "pv2"
     LEFT JOIN "public"."Product" "p" ON (("pv2"."id" = "p"."id")))
     LEFT JOIN "public"."ProductModel" "pm" ON (("pm"."id" = "p"."model")))
     LEFT JOIN "public"."ProductBrand" "pb" ON (("pb"."id" = "pm"."brand")))
     LEFT JOIN "public"."ProductCategory" "pc" ON (("pc"."id" = "pm"."category")))
     LEFT JOIN "public"."QuantityType" "qt" ON (("qt"."id" = "pc"."quantity_type")))
     LEFT JOIN "public"."File" "f" ON (("f"."id" = "p"."image")));


ALTER TABLE "public"."product_view" OWNER TO "postgres";


ALTER TABLE ONLY "matching"."MatchingPool"
    ADD CONSTRAINT "CrawlingPool_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "matching"."MatchingSource"
    ADD CONSTRAINT "CrawlingSource_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "matching"."MatchingInput"
    ADD CONSTRAINT "MatchingInput_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "matching"."MatchingIntent"
    ADD CONSTRAINT "MatchingIntent_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "matching"."MatchingSourceIntent"
    ADD CONSTRAINT "MatchingSourceIntent_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "matching"."ProcessIntent"
    ADD CONSTRAINT "ProcessIntent_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "matching"."ProductToModerateSpecs"
    ADD CONSTRAINT "ProductToModerateSpecs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "matching"."ProductToModerate"
    ADD CONSTRAINT "ProductToModerate_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "matching"."PromptMetadata"
    ADD CONSTRAINT "PromptMetadata_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ProductBrand"
    ADD CONSTRAINT "Brand_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Dictionary"
    ADD CONSTRAINT "Dictionary_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."File"
    ADD CONSTRAINT "File_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Country"
    ADD CONSTRAINT "Market_pkey" PRIMARY KEY ("label");



ALTER TABLE ONLY "public"."ProductBrandCategory"
    ADD CONSTRAINT "ProductBrandCategory_pkey" PRIMARY KEY ("category", "brand");



ALTER TABLE ONLY "public"."ProductCategory"
    ADD CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id");





ALTER TABLE ONLY "public"."ProductModelCategory"
    ADD CONSTRAINT "ProductModelCategory_pkey" PRIMARY KEY ("category", "brand");



ALTER TABLE ONLY "public"."ProductModel"
    ADD CONSTRAINT "ProductModel_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ProductPackaging"
    ADD CONSTRAINT "ProductPackaging_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ProductSellContextPrice"
    ADD CONSTRAINT "ProductSellContextPrice_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ProductSellContext"
    ADD CONSTRAINT "ProductSellContext_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ProductSpecsMapping"
    ADD CONSTRAINT "ProductSpecsMapping_pkey" PRIMARY KEY ("product_id", "spec_id");



ALTER TABLE ONLY "public"."ProductSpecs"
    ADD CONSTRAINT "ProductSpecs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");




ALTER TABLE ONLY "public"."ShopIdentifier"
    ADD CONSTRAINT "ShopIdentifier_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Shop"
    ADD CONSTRAINT "Shop_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_favory"
    ADD CONSTRAINT "product_favory_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "productsellcontextprice_sell_context_date_key" ON "public"."ProductSellContextPrice" USING "btree" ("sell_context", "date");



CREATE OR REPLACE VIEW "public"."product_sell_context_view" WITH ("security_invoker"='on') AS
 SELECT "p"."id" AS "product_id",
    "pp"."id" AS "packaging_id",
    "psc"."id" AS "sell_context_id",
    "psc"."price",
    "pp"."quantity",
    ("psc"."price" / "pp"."quantity") AS "price_per_unit",
    "s"."id" AS "shop_id",
    "s"."label" AS "shop_name"
   FROM ((("public"."ProductSellContext" "psc"
     LEFT JOIN "public"."ProductPackaging" "pp" ON (("psc"."packaging" = "pp"."id")))
     LEFT JOIN "public"."Product" "p" ON (("p"."id" = "pp"."product")))
     LEFT JOIN "public"."Shop" "s" ON (("s"."id" = "psc"."shop")))
  GROUP BY "p"."id", "pp"."id", "psc"."id", "s"."label", "s"."id";



CREATE OR REPLACE TRIGGER "after_matching_intent_insert" AFTER INSERT ON "matching"."MatchingIntent" FOR EACH ROW EXECUTE FUNCTION "matching"."triggerLaunchMatchingIntent"();



CREATE OR REPLACE TRIGGER "launch_source_trigger" AFTER INSERT ON "matching"."MatchingSourceIntent" FOR EACH ROW EXECUTE FUNCTION "matching"."trigger_launch_source"();



CREATE OR REPLACE TRIGGER "trg_launch_processing" AFTER UPDATE OF "status" ON "matching"."MatchingSourceIntent" FOR EACH ROW EXECUTE FUNCTION "matching"."triggerLaunchProcessing"();



CREATE OR REPLACE TRIGGER "update_matching_intent_status" AFTER UPDATE ON "matching"."MatchingSourceIntent" FOR EACH ROW EXECUTE FUNCTION "matching"."triggerUpdateIntentStatus"();



CREATE OR REPLACE TRIGGER "trg_update_product_sell_context_price" AFTER INSERT OR UPDATE ON "public"."ProductSellContextPrice" FOR EACH ROW EXECUTE FUNCTION "public"."update_product_sell_context_price"();



ALTER TABLE ONLY "matching"."MatchingPool"
    ADD CONSTRAINT "CrawlingPool_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."ProductCategory"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "matching"."MatchingPool"
    ADD CONSTRAINT "CrawlingPool_prompt_fkey" FOREIGN KEY ("prompt") REFERENCES "matching"."PromptMetadata"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "matching"."MatchingSource"
    ADD CONSTRAINT "CrawlingSource_shop_fkey" FOREIGN KEY ("shop") REFERENCES "public"."Shop"("id");



ALTER TABLE ONLY "matching"."MatchingInput"
    ADD CONSTRAINT "MatchingInput_source_intent_fkey" FOREIGN KEY ("source_intent") REFERENCES "matching"."MatchingSourceIntent"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "matching"."MatchingIntent"
    ADD CONSTRAINT "MatchingIntent_pool_fkey" FOREIGN KEY ("pool") REFERENCES "matching"."MatchingPool"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "matching"."MatchingSourceIntent"
    ADD CONSTRAINT "MatchingSourceIntent_pool_intent_fkey" FOREIGN KEY ("pool_intent") REFERENCES "matching"."MatchingIntent"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "matching"."MatchingSourceIntent"
    ADD CONSTRAINT "MatchingSourceIntent_source_fkey" FOREIGN KEY ("source") REFERENCES "matching"."MatchingSource"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "matching"."MatchingSource"
    ADD CONSTRAINT "MatchingSource_pool_fkey" FOREIGN KEY ("pool") REFERENCES "matching"."MatchingPool"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "matching"."ProductToModerateSpecs"
    ADD CONSTRAINT "ProductToModerateSpecs_product_fkey" FOREIGN KEY ("product") REFERENCES "matching"."ProductToModerate"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "matching"."ProductToModerateSpecs"
    ADD CONSTRAINT "ProductToModerateSpecs_specs_fkey" FOREIGN KEY ("specs") REFERENCES "public"."ProductSpecs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "matching"."ProductToModerate"
    ADD CONSTRAINT "ProductToModerate_brand_fkey" FOREIGN KEY ("brand") REFERENCES "public"."ProductBrand"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "matching"."ProductToModerate"
    ADD CONSTRAINT "ProductToModerate_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."ProductCategory"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "matching"."ProductToModerate"
    ADD CONSTRAINT "ProductToModerate_intent_fkey" FOREIGN KEY ("intent") REFERENCES "matching"."MatchingIntent"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "matching"."ProductToModerate"
    ADD CONSTRAINT "ProductToModerate_model_fkey" FOREIGN KEY ("model") REFERENCES "public"."ProductModel"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "matching"."ProductToModerate"
    ADD CONSTRAINT "ProductToModerate_shop_fkey" FOREIGN KEY ("shop") REFERENCES "public"."Shop"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."File"
    ADD CONSTRAINT "File_file_bucket_file_path_fkey" FOREIGN KEY ("file_bucket", "file_path") REFERENCES "storage"."objects"("bucket_id", "name");



ALTER TABLE ONLY "public"."ProductBrandCategory"
    ADD CONSTRAINT "ProductBrandCategory_brand_fkey" FOREIGN KEY ("brand") REFERENCES "public"."ProductBrand"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ProductBrandCategory"
    ADD CONSTRAINT "ProductBrandCategory_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."ProductCategory"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ProductCategory"
    ADD CONSTRAINT "ProductCategory_country_fkey" FOREIGN KEY ("country") REFERENCES "public"."Country"("label") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ProductCategory"
    ADD CONSTRAINT "ProductCategory_image_bucket_image_path_fkey" FOREIGN KEY ("image_bucket", "image_path") REFERENCES "storage"."objects"("bucket_id", "name") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ProductModelCategory"
    ADD CONSTRAINT "ProductModelCategory_brand_fkey" FOREIGN KEY ("brand") REFERENCES "public"."ProductBrand"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ProductModelCategory"
    ADD CONSTRAINT "ProductModelCategory_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."ProductCategory"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ProductModel"
    ADD CONSTRAINT "ProductModel_brand_fkey" FOREIGN KEY ("brand") REFERENCES "public"."ProductBrand"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ProductModel"
    ADD CONSTRAINT "ProductModel_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."ProductCategory"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ProductPackaging"
    ADD CONSTRAINT "ProductPackaging_image_fkey" FOREIGN KEY ("image") REFERENCES "public"."File"("id");



ALTER TABLE ONLY "public"."ProductPackaging"
    ADD CONSTRAINT "ProductPackaging_product_fkey" FOREIGN KEY ("product") REFERENCES "public"."Product"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ProductSellContextPrice"
    ADD CONSTRAINT "ProductSellContextPrice_sell_context_fkey" FOREIGN KEY ("sell_context") REFERENCES "public"."ProductSellContext"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ProductSellContext"
    ADD CONSTRAINT "ProductSellContext_packaging_fkey" FOREIGN KEY ("packaging") REFERENCES "public"."ProductPackaging"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ProductSellContext"
    ADD CONSTRAINT "ProductSellContext_shop_fkey" FOREIGN KEY ("shop") REFERENCES "public"."Shop"("id");



ALTER TABLE ONLY "public"."ProductSpecsMapping"
    ADD CONSTRAINT "ProductSpecsMapping_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ProductSpecsMapping"
    ADD CONSTRAINT "ProductSpecsMapping_spec_id_fkey" FOREIGN KEY ("spec_id") REFERENCES "public"."ProductSpecs"("id");



ALTER TABLE ONLY "public"."ProductSpecs"
    ADD CONSTRAINT "ProductSpecs_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."ProductCategory"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Product"
    ADD CONSTRAINT "Product_brand_fkey" FOREIGN KEY ("brand") REFERENCES "public"."ProductBrand"("id");



ALTER TABLE ONLY "public"."Product"
    ADD CONSTRAINT "Product_image_fkey" FOREIGN KEY ("image") REFERENCES "public"."File"("id");



ALTER TABLE ONLY "public"."Product"
    ADD CONSTRAINT "Product_model_fkey" FOREIGN KEY ("model") REFERENCES "public"."ProductModel"("id");



ALTER TABLE ONLY "public"."ShopIdentifier"
    ADD CONSTRAINT "ShopIdentifier_shop_fkey" FOREIGN KEY ("shop") REFERENCES "public"."Shop"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_favory"
    ADD CONSTRAINT "product_favory_owner_fkey" FOREIGN KEY ("owner") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_favory"
    ADD CONSTRAINT "product_favory_product_fkey" FOREIGN KEY ("product") REFERENCES "public"."Product"("id") ON DELETE CASCADE;



CREATE POLICY "Enable read access for all users" ON "matching"."MatchingIntent" FOR SELECT TO "anon", "service_role" USING (true);



CREATE POLICY "Enable read access for all users" ON "matching"."MatchingSourceIntent" FOR SELECT USING (true);



CREATE POLICY "Enable read access for service role" ON "matching"."MatchingSource" FOR SELECT TO "service_role" USING (true);



ALTER TABLE "matching"."MatchingInput" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "matching"."MatchingIntent" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "matching"."MatchingPool" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "matching"."MatchingSource" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "matching"."MatchingSourceIntent" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "matching"."ProcessIntent" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "matching"."PromptMetadata" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Country" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Dictionary" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Enable delete for users based on user_id" ON "public"."product_favory" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "owner"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."product_favory" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for service_role inside ProductSellContextPrice" ON "public"."ProductSellContextPrice" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."File" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Product" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."ProductBrand" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."ProductBrandCategory" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."ProductCategory" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."ProductModel" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."ProductPackaging" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."ProductSellContext" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."ProductSellContextPrice" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."ProductSpecs" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Shop" FOR SELECT USING (true);



CREATE POLICY "Enable update for servie_role inside ProductSellContextPrice" ON "public"."ProductSellContextPrice" FOR UPDATE TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Enable users to view their own data only" ON "public"."product_favory" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "owner"));



ALTER TABLE "public"."File" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Product" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ProductBrand" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ProductBrandCategory" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ProductCategory" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ProductModel" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ProductModelCategory" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ProductPackaging" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ProductSellContext" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ProductSellContextPrice" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ProductSpecs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Shop" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ShopIdentifier" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_favory" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "matching"."MatchingIntent";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "matching"."MatchingSourceIntent";






GRANT USAGE ON SCHEMA "matching" TO "service_role";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";












































































































































































































GRANT ALL ON FUNCTION "public"."launchApifyActor"("p_actor_id" "text", "p_body" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."launchApifyActor"("p_actor_id" "text", "p_body" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."launchApifyActor"("p_actor_id" "text", "p_body" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."launchCrawl"() TO "anon";
GRANT ALL ON FUNCTION "public"."launchCrawl"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."launchCrawl"() TO "service_role";



GRANT ALL ON FUNCTION "public"."setPrice"("p_link" "text", "p_price" real, "p_date" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."setPrice"("p_link" "text", "p_price" real, "p_date" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."setPrice"("p_link" "text", "p_price" real, "p_date" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_product_sell_context_price"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_product_sell_context_price"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_product_sell_context_price"() TO "service_role";
























GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "matching"."MatchingInput" TO "service_role";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "matching"."MatchingIntent" TO "service_role";



GRANT ALL ON TABLE "matching"."MatchingPool" TO "service_role";



GRANT ALL ON TABLE "matching"."MatchingSource" TO "service_role";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "matching"."MatchingSourceIntent" TO "service_role";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "matching"."ProcessIntent" TO "service_role";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "matching"."ProductToModerate" TO "service_role";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "matching"."ProductToModerateSpecs" TO "service_role";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "matching"."PromptMetadata" TO "service_role";












GRANT ALL ON TABLE "public"."Country" TO "anon";
GRANT ALL ON TABLE "public"."Country" TO "authenticated";
GRANT ALL ON TABLE "public"."Country" TO "service_role";



GRANT ALL ON TABLE "public"."Dictionary" TO "anon";
GRANT ALL ON TABLE "public"."Dictionary" TO "authenticated";
GRANT ALL ON TABLE "public"."Dictionary" TO "service_role";



GRANT ALL ON TABLE "public"."File" TO "anon";
GRANT ALL ON TABLE "public"."File" TO "authenticated";
GRANT ALL ON TABLE "public"."File" TO "service_role";



GRANT ALL ON TABLE "public"."Product" TO "anon";
GRANT ALL ON TABLE "public"."Product" TO "authenticated";
GRANT ALL ON TABLE "public"."Product" TO "service_role";



GRANT ALL ON TABLE "public"."ProductBrand" TO "anon";
GRANT ALL ON TABLE "public"."ProductBrand" TO "authenticated";
GRANT ALL ON TABLE "public"."ProductBrand" TO "service_role";



GRANT ALL ON TABLE "public"."ProductBrandCategory" TO "anon";
GRANT ALL ON TABLE "public"."ProductBrandCategory" TO "authenticated";
GRANT ALL ON TABLE "public"."ProductBrandCategory" TO "service_role";



GRANT ALL ON TABLE "public"."ProductCategory" TO "anon";
GRANT ALL ON TABLE "public"."ProductCategory" TO "authenticated";
GRANT ALL ON TABLE "public"."ProductCategory" TO "service_role";



GRANT ALL ON TABLE "public"."ProductModel" TO "anon";
GRANT ALL ON TABLE "public"."ProductModel" TO "authenticated";
GRANT ALL ON TABLE "public"."ProductModel" TO "service_role";



GRANT ALL ON TABLE "public"."ProductModelCategory" TO "anon";
GRANT ALL ON TABLE "public"."ProductModelCategory" TO "authenticated";
GRANT ALL ON TABLE "public"."ProductModelCategory" TO "service_role";



GRANT ALL ON TABLE "public"."ProductPackaging" TO "anon";
GRANT ALL ON TABLE "public"."ProductPackaging" TO "authenticated";
GRANT ALL ON TABLE "public"."ProductPackaging" TO "service_role";



GRANT ALL ON TABLE "public"."ProductSellContext" TO "anon";
GRANT ALL ON TABLE "public"."ProductSellContext" TO "authenticated";
GRANT ALL ON TABLE "public"."ProductSellContext" TO "service_role";



GRANT ALL ON TABLE "public"."ProductSellContextPrice" TO "anon";
GRANT ALL ON TABLE "public"."ProductSellContextPrice" TO "authenticated";
GRANT ALL ON TABLE "public"."ProductSellContextPrice" TO "service_role";



GRANT ALL ON TABLE "public"."ProductSpecs" TO "anon";
GRANT ALL ON TABLE "public"."ProductSpecs" TO "authenticated";
GRANT ALL ON TABLE "public"."ProductSpecs" TO "service_role";



GRANT ALL ON TABLE "public"."ProductSpecsMapping" TO "anon";
GRANT ALL ON TABLE "public"."ProductSpecsMapping" TO "authenticated";
GRANT ALL ON TABLE "public"."ProductSpecsMapping" TO "service_role";



GRANT ALL ON TABLE "public"."Shop" TO "anon";
GRANT ALL ON TABLE "public"."Shop" TO "authenticated";
GRANT ALL ON TABLE "public"."Shop" TO "service_role";



GRANT ALL ON TABLE "public"."ShopIdentifier" TO "anon";
GRANT ALL ON TABLE "public"."ShopIdentifier" TO "authenticated";
GRANT ALL ON TABLE "public"."ShopIdentifier" TO "service_role";



GRANT ALL ON SEQUENCE "public"."ShopIdentifier_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ShopIdentifier_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ShopIdentifier_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."product_favory" TO "anon";
GRANT ALL ON TABLE "public"."product_favory" TO "authenticated";
GRANT ALL ON TABLE "public"."product_favory" TO "service_role";



GRANT ALL ON TABLE "public"."product_sell_context_view" TO "anon";
GRANT ALL ON TABLE "public"."product_sell_context_view" TO "authenticated";
GRANT ALL ON TABLE "public"."product_sell_context_view" TO "service_role";



GRANT ALL ON TABLE "public"."product_packaging_view" TO "anon";
GRANT ALL ON TABLE "public"."product_packaging_view" TO "authenticated";
GRANT ALL ON TABLE "public"."product_packaging_view" TO "service_role";



GRANT ALL ON TABLE "public"."product_view" TO "anon";
GRANT ALL ON TABLE "public"."product_view" TO "authenticated";
GRANT ALL ON TABLE "public"."product_view" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "matching" GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES  TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;

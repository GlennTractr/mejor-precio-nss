drop trigger if exists "after_matching_intent_insert" on "matching"."MatchingIntent";

drop trigger if exists "launch_source_trigger" on "matching"."MatchingSourceIntent";

drop trigger if exists "trg_launch_processing" on "matching"."MatchingSourceIntent";

drop trigger if exists "update_matching_intent_status" on "matching"."MatchingSourceIntent";

drop policy "Enable read access for all users" on "matching"."MatchingIntent";

drop policy "Enable read access for service role" on "matching"."MatchingSource";

drop policy "Enable read access for all users" on "matching"."MatchingSourceIntent";

revoke delete on table "matching"."MatchingInput" from "service_role";

revoke insert on table "matching"."MatchingInput" from "service_role";

revoke select on table "matching"."MatchingInput" from "service_role";

revoke update on table "matching"."MatchingInput" from "service_role";

revoke delete on table "matching"."MatchingIntent" from "service_role";

revoke insert on table "matching"."MatchingIntent" from "service_role";

revoke select on table "matching"."MatchingIntent" from "service_role";

revoke update on table "matching"."MatchingIntent" from "service_role";

revoke delete on table "matching"."MatchingPool" from "service_role";

revoke insert on table "matching"."MatchingPool" from "service_role";

revoke references on table "matching"."MatchingPool" from "service_role";

revoke select on table "matching"."MatchingPool" from "service_role";

revoke trigger on table "matching"."MatchingPool" from "service_role";

revoke truncate on table "matching"."MatchingPool" from "service_role";

revoke update on table "matching"."MatchingPool" from "service_role";

revoke delete on table "matching"."MatchingSource" from "service_role";

revoke insert on table "matching"."MatchingSource" from "service_role";

revoke references on table "matching"."MatchingSource" from "service_role";

revoke select on table "matching"."MatchingSource" from "service_role";

revoke trigger on table "matching"."MatchingSource" from "service_role";

revoke truncate on table "matching"."MatchingSource" from "service_role";

revoke update on table "matching"."MatchingSource" from "service_role";

revoke delete on table "matching"."MatchingSourceIntent" from "service_role";

revoke insert on table "matching"."MatchingSourceIntent" from "service_role";

revoke select on table "matching"."MatchingSourceIntent" from "service_role";

revoke update on table "matching"."MatchingSourceIntent" from "service_role";

revoke delete on table "matching"."ProductToModerate" from "service_role";

revoke insert on table "matching"."ProductToModerate" from "service_role";

revoke select on table "matching"."ProductToModerate" from "service_role";

revoke update on table "matching"."ProductToModerate" from "service_role";

revoke delete on table "matching"."ProductToModerateSpecs" from "service_role";

revoke insert on table "matching"."ProductToModerateSpecs" from "service_role";

revoke select on table "matching"."ProductToModerateSpecs" from "service_role";

revoke update on table "matching"."ProductToModerateSpecs" from "service_role";

revoke delete on table "matching"."PromptMetadata" from "service_role";

revoke insert on table "matching"."PromptMetadata" from "service_role";

revoke select on table "matching"."PromptMetadata" from "service_role";

revoke update on table "matching"."PromptMetadata" from "service_role";

alter table "matching"."MatchingInput" drop constraint "MatchingInput_source_intent_fkey";

alter table "matching"."MatchingIntent" drop constraint "MatchingIntent_pool_fkey";

alter table "matching"."MatchingPool" drop constraint "CrawlingPool_category_fkey";

alter table "matching"."MatchingPool" drop constraint "CrawlingPool_prompt_fkey";

alter table "matching"."MatchingSource" drop constraint "CrawlingSource_shop_fkey";

alter table "matching"."MatchingSource" drop constraint "MatchingSource_pool_fkey";

alter table "matching"."MatchingSourceIntent" drop constraint "MatchingSourceIntent_pool_intent_fkey";

alter table "matching"."MatchingSourceIntent" drop constraint "MatchingSourceIntent_source_fkey";

alter table "matching"."ProductToModerate" drop constraint "ProductToModerate_brand_fkey";

alter table "matching"."ProductToModerate" drop constraint "ProductToModerate_category_fkey";

alter table "matching"."ProductToModerate" drop constraint "ProductToModerate_intent_fkey";

alter table "matching"."ProductToModerate" drop constraint "ProductToModerate_model_fkey";

alter table "matching"."ProductToModerate" drop constraint "ProductToModerate_shop_fkey";

alter table "matching"."ProductToModerateSpecs" drop constraint "ProductToModerateSpecs_product_fkey";

alter table "matching"."ProductToModerateSpecs" drop constraint "ProductToModerateSpecs_specs_fkey";

alter table "matching"."MatchingInput" drop constraint "MatchingInput_pkey";

alter table "matching"."MatchingIntent" drop constraint "MatchingIntent_pkey";

alter table "matching"."MatchingPool" drop constraint "CrawlingPool_pkey";

alter table "matching"."MatchingSource" drop constraint "CrawlingSource_pkey";

alter table "matching"."MatchingSourceIntent" drop constraint "MatchingSourceIntent_pkey";

alter table "matching"."ProductToModerate" drop constraint "ProductToModerate_pkey";

alter table "matching"."ProductToModerateSpecs" drop constraint "ProductToModerateSpecs_pkey";

alter table "matching"."PromptMetadata" drop constraint "PromptMetadata_pkey";

drop index if exists "matching"."CrawlingPool_pkey";

drop index if exists "matching"."CrawlingSource_pkey";

drop index if exists "matching"."MatchingInput_pkey";

drop index if exists "matching"."MatchingIntent_pkey";

drop index if exists "matching"."MatchingSourceIntent_pkey";

drop index if exists "matching"."ProductToModerateSpecs_pkey";

drop index if exists "matching"."ProductToModerate_pkey";

drop index if exists "matching"."PromptMetadata_pkey";

drop table "matching"."MatchingInput";

drop table "matching"."MatchingIntent";

drop table "matching"."MatchingPool";

drop table "matching"."MatchingSource";

drop table "matching"."MatchingSourceIntent";

drop table "matching"."ProductToModerate";

drop table "matching"."ProductToModerateSpecs";

drop table "matching"."PromptMetadata";


revoke delete on table "public"."Dictionary" from "anon";

revoke insert on table "public"."Dictionary" from "anon";

revoke references on table "public"."Dictionary" from "anon";

revoke select on table "public"."Dictionary" from "anon";

revoke trigger on table "public"."Dictionary" from "anon";

revoke truncate on table "public"."Dictionary" from "anon";

revoke update on table "public"."Dictionary" from "anon";

revoke delete on table "public"."Dictionary" from "authenticated";

revoke insert on table "public"."Dictionary" from "authenticated";

revoke references on table "public"."Dictionary" from "authenticated";

revoke select on table "public"."Dictionary" from "authenticated";

revoke trigger on table "public"."Dictionary" from "authenticated";

revoke truncate on table "public"."Dictionary" from "authenticated";

revoke update on table "public"."Dictionary" from "authenticated";

revoke delete on table "public"."Dictionary" from "service_role";

revoke insert on table "public"."Dictionary" from "service_role";

revoke references on table "public"."Dictionary" from "service_role";

revoke select on table "public"."Dictionary" from "service_role";

revoke trigger on table "public"."Dictionary" from "service_role";

revoke truncate on table "public"."Dictionary" from "service_role";

revoke update on table "public"."Dictionary" from "service_role";

alter table "public"."Dictionary" drop constraint "Dictionary_pkey";

drop index if exists "public"."Dictionary_pkey";

drop table "public"."Dictionary";



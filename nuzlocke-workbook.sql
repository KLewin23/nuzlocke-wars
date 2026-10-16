-- Active: 1791947165204@@127.0.0.1@54321
SELECT * FROM public."user";
SELECT * FROM public."draft";
SELECT * FROM public."round";
SELECT * FROM public."team";
SELECT * FROM public."users_to_drafts";

SELECT *
  FROM information_schema.columns
 WHERE table_schema = 'public'
   AND table_name   = 'round'
     ;


SELECT * FROM public.users_to_drafts
INNER JOIN public."user" ON users_to_drafts.user_id = public."user".id
LEFT JOIN round ON round.target_user_id = public."user".id AND round.draft_id = 1
WHERE users_to_drafts.draft_id = 1
AND round.id IS null
AND team_role = 'player';


-- INSERT INTO public.team (display_name) VALUES ('my_team');

-- INSERT INTO public.draft  (name, status, round_length) VALUES
--     ('test', 'active', 60);

INSERT INTO public.round (draft_id, round_status, target_user_id) VALUES (1, 'bidding', '3SdBeodKutroNI8zCdXi8yVrVpQj4IOB');

INSERT INTO public.users_to_drafts (draft_id, user_id, team_role, team_id)
VALUES (1, '3SdBeodKutroNI8zCdXi8yVrVpQj4IOB', 'player', null);


SELECT * FROM public.users_to_drafts 
INNER JOIN draft ON users_to_drafts.draft_id = draft.id
INNER JOIN round ON draft.current_round_id = round.id
WHERE user_id = '0f1fwHW9eqkhKqyuWUpI6xozmoFpnoo1' 
AND users_to_drafts.draft_id = 1
AND team_role = 'captain'
AND draft.status = 'active'
AND round_status = 'bidding'
AND CURRENT_TIMESTAMP < round.bidding_start_time + draft.round_length * interval '1 second'


UPDATE public.round
SET bidding_start_time = current_timestamp
WHERE id = 3



			-- .select({
			-- 	id: draft.id,
			-- 	name: draft.name,
			-- 	status: draft.status,
			-- 	playerCount: count(usersToDrafts.userId),
			-- })
			-- .from(draft)
			-- .leftJoin(usersToDrafts, eq(draft.id, usersToDrafts.draftId))
			-- .groupBy(draft.id);

SELECT draft.id, count(usersToDrafts.userId) 
FROM public.draft 
LEFT JOIN users_to_drafts ON draft.id = "public.users_to_drafts".draft_id
GROUP BY draft.id
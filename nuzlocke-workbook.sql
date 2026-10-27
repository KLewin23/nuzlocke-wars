-- Active: 1791947165204@@127.0.0.1@54321
SELECT * FROM public."user";
SELECT * FROM public."account";

SELECT * FROM public."draft";

SELECT * FROM public."round";

SELECT * FROM public."bid";

SELECT * FROM public."team";
SELECT * FROM public."round";

SELECT * FROM public."players_to_drafts";

SELECT * FROM public."teams_to_drafts";

SELECT * FROM public."user" WHERE id = 'CdZBwbuGsvfQSUADoJfp4M8QkyGXfSWQ'

UPDATE round
SET round_status = 'pre_bidding', bidding_start_time = NULL
WHERE id = 1; 


SELECT round.target_user_id, draft.id, bid.team_name
FROM draft
JOIN round ON draft.id = round.draft_id
JOIN bid ON draft.id = bid.draft_id AND bid.round_id = round.id
WHERE draft.id = 1 
ORDER BY bid.amount DESC
LIMIT 1;


SELECT draft.id, draft.name, draft.status, count(players_to_drafts.user_id)
FROM draft
LEFT JOIN players_to_drafts ON players_to_drafts.draft_id = draft.id
WHERE draft.id IN (
    select players.draft_id FROM players_to_drafts as players WHERE players.user_id = 'CdZBwbuGsvfQSUADoJfp4M8QkyGXfSWQ'
)
GROUP BY draft.id


SELECT * FROM players_to_drafts WHERE players_to_drafts.user_id = 'CdZBwbuGsvfQSUADoJfp4M8QkyGXfSWQ';

-- Load into draft
-- First request when they come into draft
SELECT
    draft.name,
    status,
    round_length,
    initial_player_coins,
    max_players_per_team,
    round_status,
    bidding_start_time,
    image, -- TARGET_USER_IMAGE
    username -- TARGET_USER_UNAME
FROM
    draft
    JOIN round ON draft.current_round_id = round.id
    LEFT JOIN public."user" ON round.target_user_id = "public".user.id
    JOIN users_to_drafts ON users_to_drafts.draft_id = draft.id
WHERE
    draft.id = 42
    -- AND users_to_drafts.user_id = 'EHirX9rXVgweX6Wy2KFZ6F8yDzCJZiVY'

-- Current amount spent for each team captain -- run on load (subtract from initial_player_coins)

SELECT sum(bid.amount), teams_to_drafts.team_name
FROM teams_to_drafts
JOIN bid ON teams_to_drafts.team_name = bid.team_name AND teams_to_drafts.draft_id = bid.draft_id
WHERE teams_to_drafts.draft_id = 1
GROUP BY teams_to_drafts.team_name


-- Get Teams -- Run on Load &
SELECT users_to_drafts.user_id, team.name, users_to_drafts.team_role, team.name, public."user".username, public."user".image
FROM users_to_drafts
JOIN team ON users_to_drafts.team_name = team.name
JOIN public."user" ON users_to_drafts.user_id = public."user".id
JOIN public."user" ON teamsToDrafts.captain_id = public."user".id
WHERE users_to_drafts.draft_id = 42
GROUP BY public."user".id

SELECT teams_to_drafts.team_name, public."user".username, public."user".image
FROM teams_to_drafts
JOIN public."user" ON teams_to_drafts.captain_id = public."user".id
JOIN draft ON teams_to_drafts.draft_id = draft.id
JOIN players_to_drafts ON players_to_drafts.draft_id = draft.id


-- Bidding has ended, bid submitted, bid retracted
SELECT teams_to_drafts.captain_id,teams_to_drafts.team_name, public."user".username, public."user".image, sum(bid.amount)
FROM teams_to_drafts
JOIN public."user" ON teams_to_drafts.captain_id = public."user".id
LEFT JOIN bid ON teams_to_drafts.team_name = bid.team_name AND teams_to_drafts.draft_id = bid.draft_id
GROUP BY teams_to_drafts.captain_id, teams_to_drafts.team_name, public."user".username, public."user".image


-- Round Started or Bidding has started
SELECT round.bidding_start_time, draft.round_length, public."user".id, public."user".username, public."user".image
FROM draft
    JOIN round ON draft.current_round_id = round.id
    LEFT JOIN public."user" ON round.target_user_id = "public".user.id
WHERE
    draft.id = 1


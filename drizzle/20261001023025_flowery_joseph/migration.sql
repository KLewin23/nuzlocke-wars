CREATE TYPE "draft_status" AS ENUM('closed', 'open', 'active', 'complete');--> statement-breakpoint
CREATE TYPE "round_status" AS ENUM('pre_bidding', 'bidding', 'post_bidding');--> statement-breakpoint
CREATE TYPE "team_role" AS ENUM('captain', 'player');--> statement-breakpoint
CREATE TABLE "bid" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"round_id" integer NOT NULL,
	"amount" integer
);
--> statement-breakpoint
CREATE TABLE "draft" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"status" "draft_status",
	"round_length" integer DEFAULT 60 NOT NULL,
	"initial_player_coins" integer DEFAULT 60,
	"current_round_id" integer
);
--> statement-breakpoint
CREATE TABLE "round" (
	"id" serial PRIMARY KEY,
	"draft_id" integer NOT NULL,
	"roundStatus" "round_status"
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" serial PRIMARY KEY,
	"display_name" text NOT NULL,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "users_to_drafts" (
	"user_id" text,
	"draft_id" integer,
	"team_id" integer,
	"teamRole" "team_role",
	CONSTRAINT "users_to_drafts_pkey" PRIMARY KEY("draft_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "bid" ADD CONSTRAINT "bid_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "bid" ADD CONSTRAINT "bid_round_id_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round"("id");--> statement-breakpoint
ALTER TABLE "draft" ADD CONSTRAINT "draft_current_round_id_round_id_fkey" FOREIGN KEY ("current_round_id") REFERENCES "round"("id");--> statement-breakpoint
ALTER TABLE "round" ADD CONSTRAINT "round_draft_id_draft_id_fkey" FOREIGN KEY ("draft_id") REFERENCES "draft"("id");--> statement-breakpoint
ALTER TABLE "users_to_drafts" ADD CONSTRAINT "users_to_drafts_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "users_to_drafts" ADD CONSTRAINT "users_to_drafts_draft_id_draft_id_fkey" FOREIGN KEY ("draft_id") REFERENCES "draft"("id");--> statement-breakpoint
ALTER TABLE "users_to_drafts" ADD CONSTRAINT "users_to_drafts_team_id_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id");
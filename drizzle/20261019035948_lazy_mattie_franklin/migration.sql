CREATE TYPE "draft_status" AS ENUM('closed', 'open', 'active', 'complete');--> statement-breakpoint
CREATE TYPE "round_status" AS ENUM('pre_bidding', 'bidding', 'post_bidding');--> statement-breakpoint
CREATE TYPE "team_role" AS ENUM('captain', 'player');--> statement-breakpoint
CREATE TYPE "role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "bid" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"round_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"isWinner" boolean
);
--> statement-breakpoint
CREATE TABLE "draft" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"status" "draft_status" DEFAULT 'closed'::"draft_status" NOT NULL,
	"round_length" integer DEFAULT 60 NOT NULL,
	"initial_player_coins" integer DEFAULT 60,
	"max_players_per_team" integer DEFAULT 8 NOT NULL,
	"current_round_id" integer
);
--> statement-breakpoint
CREATE TABLE "round" (
	"id" serial PRIMARY KEY,
	"draft_id" integer NOT NULL,
	"target_user_id" text NOT NULL,
	"round_status" "round_status" DEFAULT 'pre_bidding'::"round_status" NOT NULL,
	"bidding_start_time" timestamp
);
--> statement-breakpoint
CREATE TABLE "team" (
	"name" text PRIMARY KEY,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "teams_to_drafts" (
	"team_name" text,
	"draft_id" integer,
	CONSTRAINT "teams_to_drafts_pkey" PRIMARY KEY("team_name","draft_id")
);
--> statement-breakpoint
CREATE TABLE "users_to_drafts" (
	"user_id" text,
	"draft_id" integer,
	"team_name" text,
	"team_role" "team_role" NOT NULL,
	CONSTRAINT "users_to_drafts_pkey" PRIMARY KEY("draft_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"username" text NOT NULL UNIQUE,
	"display_username" text,
	"role" "role" DEFAULT 'user'::"role" NOT NULL,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
ALTER TABLE "bid" ADD CONSTRAINT "bid_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "bid" ADD CONSTRAINT "bid_round_id_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "draft" ADD CONSTRAINT "draft_current_round_id_round_id_fkey" FOREIGN KEY ("current_round_id") REFERENCES "round"("id");--> statement-breakpoint
ALTER TABLE "round" ADD CONSTRAINT "round_draft_id_draft_id_fkey" FOREIGN KEY ("draft_id") REFERENCES "draft"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "round" ADD CONSTRAINT "round_target_user_id_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "teams_to_drafts" ADD CONSTRAINT "teams_to_drafts_team_name_team_name_fkey" FOREIGN KEY ("team_name") REFERENCES "team"("name");--> statement-breakpoint
ALTER TABLE "teams_to_drafts" ADD CONSTRAINT "teams_to_drafts_draft_id_draft_id_fkey" FOREIGN KEY ("draft_id") REFERENCES "draft"("id");--> statement-breakpoint
ALTER TABLE "users_to_drafts" ADD CONSTRAINT "users_to_drafts_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "users_to_drafts" ADD CONSTRAINT "users_to_drafts_draft_id_draft_id_fkey" FOREIGN KEY ("draft_id") REFERENCES "draft"("id");--> statement-breakpoint
ALTER TABLE "users_to_drafts" ADD CONSTRAINT "users_to_drafts_team_name_team_name_fkey" FOREIGN KEY ("team_name") REFERENCES "team"("name");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
CREATE TABLE "teams_to_drafts" (
	"team_id" integer,
	"draft_id" integer,
	CONSTRAINT "teams_to_drafts_pkey" PRIMARY KEY("team_id","draft_id")
);
--> statement-breakpoint
ALTER TABLE "round" RENAME COLUMN "roundStatus" TO "round_status";--> statement-breakpoint
ALTER TABLE "users_to_drafts" RENAME COLUMN "teamRole" TO "team_role";--> statement-breakpoint
ALTER TABLE "bid" ADD COLUMN "isWinner" boolean;--> statement-breakpoint
ALTER TABLE "draft" ADD COLUMN "max_players_per_team" integer DEFAULT 8 NOT NULL;--> statement-breakpoint
ALTER TABLE "round" ADD COLUMN "target_user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "round" ADD COLUMN "bidding_start_time" timestamp;--> statement-breakpoint
ALTER TABLE "bid" ALTER COLUMN "amount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "draft" ALTER COLUMN "status" SET DEFAULT 'closed'::"draft_status";--> statement-breakpoint
ALTER TABLE "draft" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "round" ALTER COLUMN "round_status" SET DEFAULT 'pre_bidding'::"round_status";--> statement-breakpoint
ALTER TABLE "round" ALTER COLUMN "round_status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users_to_drafts" ALTER COLUMN "team_role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'basic'::"role";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "round" ADD CONSTRAINT "round_target_user_id_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "teams_to_drafts" ADD CONSTRAINT "teams_to_drafts_team_id_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id");--> statement-breakpoint
ALTER TABLE "teams_to_drafts" ADD CONSTRAINT "teams_to_drafts_draft_id_draft_id_fkey" FOREIGN KEY ("draft_id") REFERENCES "draft"("id");--> statement-breakpoint
ALTER TABLE "bid" DROP CONSTRAINT "bid_round_id_round_id_fkey", ADD CONSTRAINT "bid_round_id_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "round" DROP CONSTRAINT "round_draft_id_draft_id_fkey", ADD CONSTRAINT "round_draft_id_draft_id_fkey" FOREIGN KEY ("draft_id") REFERENCES "draft"("id") ON DELETE CASCADE;
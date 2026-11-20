CREATE TYPE "clip_status" AS ENUM('approved', 'ignored');--> statement-breakpoint
CREATE TABLE "clip" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"thumbnail_url" text NOT NULL,
	"streamer_id" text NOT NULL,
	"approver_user_id" text NOT NULL,
	"creator_id" text,
	"status" "clip_status" DEFAULT 'ignored'::"clip_status" NOT NULL,
	"loaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clip_creator" (
	"twitch_id" text PRIMARY KEY,
	"display_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "streamer" (
	"twitch_id" text PRIMARY KEY,
	"display_name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clip" ADD CONSTRAINT "clip_streamer_id_streamer_twitch_id_fkey" FOREIGN KEY ("streamer_id") REFERENCES "streamer"("twitch_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "clip" ADD CONSTRAINT "clip_approver_user_id_user_id_fkey" FOREIGN KEY ("approver_user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "clip" ADD CONSTRAINT "clip_creator_id_clip_creator_twitch_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "clip_creator"("twitch_id");
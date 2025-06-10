CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"category" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"picture" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

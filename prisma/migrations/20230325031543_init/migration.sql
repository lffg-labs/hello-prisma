-- CreateTable
CREATE TABLE "petitions" (
    "id" UUID NOT NULL,
    "requester_name" TEXT NOT NULL,
    "subject_name" TEXT NOT NULL,
    "additional_data" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "petitions_pkey" PRIMARY KEY ("id")
);

import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import lodash from "lodash";
import { z } from "zod";

const posDeltaSchema = z.object({
  prevPos: z.string(),
  pos: z.string(),
});

const actionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("promotion"),
    posDelta: posDeltaSchema,
  }),
  z.object({
    type: z.literal("demotion"),
    posDelta: posDeltaSchema,
  }),
  z.object({ type: z.literal("demission") }),
]);

const petitionSchema = z.object({
  id: z.string().uuid(),
  requesterName: z.string(),
  subjectName: z.string(),
  action: actionSchema,
});

type Action = z.infer<typeof actionSchema>;
type Petition = z.infer<typeof petitionSchema>;

async function createPetition(prisma: PrismaClient, request: any) {
  const petition = petitionSchema.parse(request);
  await prisma.petition.create({
    data: {
      ...lodash.omit(petition, ["action"]),
      additionalData: {
        action: petition.action,
      },
    },
  });
  console.log("ok");
}

async function main() {
  const prisma = new PrismaClient();

  try {
    await createPetition(prisma, {
      id: randomUUID(),
      requesterName: "luiz",
      subjectName: "gabriel",
      action: {
        type: "promotion",
        posDelta: { prevPos: "soldado", pos: "cabo" },
      },
    });
  } finally {
    prisma.$disconnect();
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));

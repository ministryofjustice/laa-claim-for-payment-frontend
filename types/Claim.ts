import { z } from "zod";

export const ClaimSchema = z.object({
  id: z.number(),
  ufn: z.string().optional(),
  providerUserId: z.string().optional(),
  client: z.string().optional(),
  category: z.string().optional(),
  concluded: z.string().optional().transform(val => (val != null ? new Date(val) : undefined)),
  feeType: z.string().optional(),
  claimed: z.number().optional(),
  submissionId: z.string().optional()
});

export type Claim = z.infer<typeof ClaimSchema>;

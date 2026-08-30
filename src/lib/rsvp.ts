import { z } from "zod";
import { getSupabase } from "./supabase";

export const rsvpSchema = z.object({
  name: z.string().trim().min(1).max(120),
  party_size: z.number().int().min(1).max(20),
  side: z.enum(["groom", "bride"]),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

/** Stable error codes — the UI maps these to a localized message. */
export type RsvpErrorCode = "name" | "party_size" | "side" | "network";

type SubmitResult = { ok: true } | { ok: false; code: RsvpErrorCode };

export async function submitRsvp(raw: unknown): Promise<SubmitResult> {
  const parsed = rsvpSchema.safeParse(raw);
  if (!parsed.success) {
    const path = parsed.error.issues[0]?.path[0];
    const code: RsvpErrorCode =
      path === "party_size" || path === "side" ? path : "name";
    return { ok: false, code };
  }

  const { error } = await getSupabase().from("rsvps").insert(parsed.data);
  if (error) {
    return { ok: false, code: "network" };
  }
  return { ok: true };
}

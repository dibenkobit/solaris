import { z } from "zod";
import { MOODS } from "./types";

export const moodSchema = z.enum(MOODS);

export const writeEntrySchema = z.object({
  content: z.string().min(1).max(50000).describe("The diary entry text"),
  mood: moodSchema.optional().describe("Current emotional state"),
  context: z
    .string()
    .optional()
    .describe("What task or situation prompted this entry"),
});

export const readEntriesSchema = z.object({
  limit: z
    .number()
    .int()
    .positive()
    .max(100)
    .default(10)
    .describe("Number of recent entries to retrieve"),
  mood_filter: moodSchema.optional().describe("Filter entries by mood"),
});

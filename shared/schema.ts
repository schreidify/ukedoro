import { pgTable, text, varchar, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const accentColorEnum = z.enum(["green", "orange"]);
export type AccentColor = z.infer<typeof accentColorEnum>;

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  sessionKey: varchar("session_key", { length: 255 }).notNull().unique(),
  workDuration: integer("work_duration").notNull().default(1500),
  breakDuration: integer("break_duration").notNull().default(300),
  resource: text("resource").notNull().default("chords"),
  accentColor: varchar("accent_color", { length: 16 }).notNull().default("orange"),
});

export const pomodoroSessions = pgTable("pomodoro_sessions", {
  id: serial("id").primaryKey(),
  sessionKey: varchar("session_key", { length: 255 }).notNull(),
  mode: text("mode").notNull(),
  duration: integer("duration").notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const insertSettingsSchema = createInsertSchema(settings, {
  accentColor: accentColorEnum.optional(),
}).omit({ id: true });
export const updateSettingsSchema = insertSettingsSchema.partial().required({ sessionKey: true });
export const insertPomodoroSessionSchema = createInsertSchema(pomodoroSessions).omit({ id: true, completedAt: true });

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type UpdateSettings = z.infer<typeof updateSettingsSchema>;
export type PomodoroSession = typeof pomodoroSessions.$inferSelect;
export type InsertPomodoroSession = z.infer<typeof insertPomodoroSessionSchema>;

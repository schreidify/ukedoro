import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  settings,
  pomodoroSessions,
  type Settings,
  type InsertSettings,
  type UpdateSettings,
  type PomodoroSession,
  type InsertPomodoroSession,
} from "@shared/schema";

export interface IStorage {
  getSettings(sessionKey: string): Promise<Settings | undefined>;
  upsertSettings(data: InsertSettings): Promise<Settings>;
  updateSettings(data: UpdateSettings): Promise<Settings | undefined>;
  createPomodoroSession(data: InsertPomodoroSession): Promise<PomodoroSession>;
  getSessionHistory(sessionKey: string, limit?: number): Promise<PomodoroSession[]>;
  getSessionStats(sessionKey: string): Promise<{ totalSessions: number; totalFocusMinutes: number; totalBreakMinutes: number }>;
}

const db = drizzle(process.env.DATABASE_URL!);

export class DatabaseStorage implements IStorage {
  async getSettings(sessionKey: string): Promise<Settings | undefined> {
    const [result] = await db.select().from(settings).where(eq(settings.sessionKey, sessionKey));
    return result;
  }

  async upsertSettings(data: InsertSettings): Promise<Settings> {
    const existing = await this.getSettings(data.sessionKey);
    if (existing) {
      const [updated] = await db
        .update(settings)
        .set(data)
        .where(eq(settings.sessionKey, data.sessionKey))
        .returning();
      return updated;
    }
    const [created] = await db.insert(settings).values(data).returning();
    return created;
  }

  async updateSettings(data: UpdateSettings): Promise<Settings | undefined> {
    const [updated] = await db
      .update(settings)
      .set(data)
      .where(eq(settings.sessionKey, data.sessionKey))
      .returning();
    return updated;
  }

  async createPomodoroSession(data: InsertPomodoroSession): Promise<PomodoroSession> {
    const [created] = await db.insert(pomodoroSessions).values(data).returning();
    return created;
  }

  async getSessionHistory(sessionKey: string, limit = 20): Promise<PomodoroSession[]> {
    return db
      .select()
      .from(pomodoroSessions)
      .where(eq(pomodoroSessions.sessionKey, sessionKey))
      .orderBy(desc(pomodoroSessions.completedAt))
      .limit(limit);
  }

  async getSessionStats(sessionKey: string): Promise<{ totalSessions: number; totalFocusMinutes: number; totalBreakMinutes: number }> {
    const sessions = await db
      .select()
      .from(pomodoroSessions)
      .where(eq(pomodoroSessions.sessionKey, sessionKey));

    const totalSessions = sessions.length;
    const totalFocusMinutes = Math.round(
      sessions.filter((s) => s.mode === "work").reduce((sum, s) => sum + s.duration, 0) / 60
    );
    const totalBreakMinutes = Math.round(
      sessions.filter((s) => s.mode === "break").reduce((sum, s) => sum + s.duration, 0) / 60
    );

    return { totalSessions, totalFocusMinutes, totalBreakMinutes };
  }
}

export const storage = new DatabaseStorage();

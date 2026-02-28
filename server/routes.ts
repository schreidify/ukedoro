import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSettingsSchema, insertPomodoroSessionSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/settings/:sessionKey", async (req, res) => {
    const { sessionKey } = req.params;
    const result = await storage.getSettings(sessionKey);
    if (!result) {
      return res.json({
        sessionKey,
        workDuration: 1500,
        breakDuration: 300,
        resource: "chords",
      });
    }
    res.json(result);
  });

  app.put("/api/settings", async (req, res) => {
    const parsed = insertSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const result = await storage.upsertSettings(parsed.data);
    res.json(result);
  });

  app.post("/api/sessions", async (req, res) => {
    const parsed = insertPomodoroSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const result = await storage.createPomodoroSession(parsed.data);
    res.json(result);
  });

  app.get("/api/sessions/:sessionKey", async (req, res) => {
    const { sessionKey } = req.params;
    const history = await storage.getSessionHistory(sessionKey);
    res.json(history);
  });

  app.get("/api/stats/:sessionKey", async (req, res) => {
    const { sessionKey } = req.params;
    const stats = await storage.getSessionStats(sessionKey);
    res.json(stats);
  });

  return httpServer;
}

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { playTimerEndSound, triggerVisualAlert } from "@/lib/timer-alert";

export type Mode = "work" | "break";
export type ResourceType = "chords" | "video";

function getSessionKey(): string {
  let key = localStorage.getItem("ukedoro-session-key");
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem("ukedoro-session-key", key);
  }
  return key;
}

export function usePomodoro() {
  const sessionKey = useRef(getSessionKey()).current;
  const queryClient = useQueryClient();

  const { data: serverSettings } = useQuery<{
    workDuration: number;
    breakDuration: number;
    resource: ResourceType;
  }>({
    queryKey: ["/api/settings", sessionKey],
  });

  const { data: stats } = useQuery<{
    totalSessions: number;
    totalFocusMinutes: number;
    totalBreakMinutes: number;
  }>({
    queryKey: ["/api/stats", sessionKey],
  });

  const [mode, setMode] = useState<Mode>("work");
  const [isActive, setIsActive] = useState(false);
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [resource, setResource] = useState<ResourceType>("chords");
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    if (serverSettings && !settingsLoaded) {
      setWorkDuration(serverSettings.workDuration);
      setBreakDuration(serverSettings.breakDuration);
      setResource(serverSettings.resource);
      setTimeLeft(serverSettings.workDuration);
      setSettingsLoaded(true);
    }
  }, [serverSettings, settingsLoaded]);

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: { workDuration: number; breakDuration: number; resource: ResourceType }) => {
      await apiRequest("PUT", "/api/settings", { sessionKey, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings", sessionKey] });
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: async (data: { mode: string; duration: number }) => {
      await apiRequest("POST", "/api/sessions", { sessionKey, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats", sessionKey] });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionKey] });
    },
  });

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(mode === "work" ? workDuration : breakDuration);
    }
  }, [workDuration, breakDuration, mode, isActive]);

  const switchMode = useCallback(() => {
    const currentDuration = mode === "work" ? workDuration : breakDuration;
    completeSessionMutation.mutate({ mode, duration: currentDuration });

    const nextMode = mode === "work" ? "break" : "work";
    setMode(nextMode);
    setTimeLeft(nextMode === "work" ? workDuration : breakDuration);
    setIsActive(true);
  }, [mode, workDuration, breakDuration, completeSessionMutation]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      const nextMode = mode === "work" ? "break" : "work";
      playTimerEndSound();
      triggerVisualAlert(nextMode);
      switchMode();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, switchMode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "work" ? workDuration : breakDuration);
  };

  const updateWorkDuration = (val: number) => {
    setWorkDuration(val);
  };

  const updateBreakDuration = (val: number) => {
    setBreakDuration(val);
  };

  const updateResource = (val: ResourceType) => {
    setResource(val);
  };

  const saveSettings = () => {
    saveSettingsMutation.mutate({ workDuration, breakDuration, resource });
  };

  const setModeAndReset = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
  };

  const currentDuration = mode === "work" ? workDuration : breakDuration;
  const progress = ((currentDuration - timeLeft) / currentDuration) * 100;

  return {
    mode,
    isActive,
    timeLeft,
    progress,
    workDuration,
    breakDuration,
    resource,
    stats: stats ?? { totalSessions: 0, totalFocusMinutes: 0, totalBreakMinutes: 0 },
    toggleTimer,
    resetTimer,
    setMode: setModeAndReset,
    setWorkDuration: updateWorkDuration,
    setBreakDuration: updateBreakDuration,
    setResource: updateResource,
    saveSettings,
  };
}

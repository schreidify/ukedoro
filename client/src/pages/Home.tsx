import { useState } from "react";
import { Play, Pause, RotateCcw, Settings, Music, Guitar, Briefcase, Timer, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimerDisplay from "@/components/timer/TimerDisplay";
import ResourceViewer from "@/components/timer/ResourceViewer";
import SettingsModal from "@/components/timer/SettingsModal";
import { motion, AnimatePresence } from "framer-motion";
import { usePomodoro } from "@/hooks/use-pomodoro";

export default function Home() {
  const {
    mode,
    isActive,
    timeLeft,
    progress,
    workDuration,
    breakDuration,
    resource,
    stats,
    toggleTimer,
    resetTimer,
    setMode,
    setWorkDuration,
    setBreakDuration,
    setResource,
    saveSettings,
  } = usePomodoro();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const primaryColor = mode === "work" ? "text-primary" : "text-break";
  const ringColor = mode === "work" ? "stroke-primary" : "stroke-break";
  const bgClass = mode === "work" ? "bg-background" : "bg-break/5";

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-700 ${bgClass} font-sans`}>
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Music className={`w-8 h-8 ${primaryColor} transition-colors duration-700`} />
          <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">UkeDoro</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border" data-testid="stat-sessions">
              <Flame className="w-4 h-4 text-primary" />
              <span className="font-medium">{stats.totalSessions}</span>
              <span>sessions</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border" data-testid="stat-focus-minutes">
              <Timer className="w-4 h-4 text-accent" />
              <span className="font-medium">{stats.totalFocusMinutes}</span>
              <span>focus min</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="hover:bg-primary/10 rounded-full"
            data-testid="button-settings"
          >
            <Settings className="w-6 h-6 text-foreground/80" />
          </Button>
        </div>
      </header>

      <main className="w-full max-w-5xl px-6 flex flex-col lg:flex-row items-center justify-center gap-12 mt-16">

        <motion.div
          layout
          className={`flex flex-col items-center justify-center ${mode === "break" ? "lg:w-1/3" : "w-full"}`}
        >
          <div className="mb-8 flex items-center gap-4 bg-white/50 backdrop-blur-sm p-1.5 rounded-full border shadow-sm">
            <button
              onClick={() => setMode("work")}
              className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                mode === "work"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground/60 hover:bg-foreground/5"
              }`}
              data-testid="button-mode-work"
            >
              <Briefcase className="w-4 h-4" /> Focus
            </button>
            <button
              onClick={() => setMode("break")}
              className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                mode === "break"
                  ? "bg-break text-break-foreground shadow-md"
                  : "text-foreground/60 hover:bg-foreground/5"
              }`}
              data-testid="button-mode-break"
            >
              <Guitar className="w-4 h-4" /> Learn Uke
            </button>
          </div>

          <TimerDisplay
            timeLeft={timeLeft}
            progress={progress}
            ringColor={ringColor}
            size={mode === "work" ? 360 : 280}
          />

          <div className="mt-10 flex items-center gap-6">
            <Button
              size="icon"
              variant="outline"
              className="w-14 h-14 rounded-full border-2 hover:bg-foreground/5"
              onClick={resetTimer}
              data-testid="button-reset"
            >
              <RotateCcw className="w-6 h-6 text-foreground/70" />
            </Button>

            <Button
              size="icon"
              className={`w-20 h-20 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                mode === "work" ? "bg-primary hover:bg-primary/90" : "bg-break hover:bg-break/90"
              }`}
              onClick={toggleTimer}
              data-testid="button-play-pause"
            >
              {isActive ? (
                <Pause className="w-8 h-8 text-white fill-current" />
              ) : (
                <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
              )}
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {mode === "break" && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "100%" }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
              className="lg:w-2/3 h-[600px] bg-white rounded-3xl shadow-xl border overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                  <Music className="w-5 h-5 text-break" />
                  Ukulele Session
                </h3>
                <div className="text-sm font-medium text-muted-foreground bg-white px-3 py-1 rounded-full border shadow-sm">
                  {resource === "chords" ? "Chord Practice" : "Video Tutorial"}
                </div>
              </div>
              <div className="flex-1 bg-muted/10 relative">
                <ResourceViewer type={resource} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          saveSettings();
          setIsSettingsOpen(false);
        }}
        workDuration={workDuration}
        setWorkDuration={setWorkDuration}
        breakDuration={breakDuration}
        setBreakDuration={setBreakDuration}
        resource={resource}
        setResource={setResource}
      />
    </div>
  );
}

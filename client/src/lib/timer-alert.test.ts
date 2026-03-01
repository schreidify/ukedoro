import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from "vitest";
import { playTimerEndSound, triggerVisualAlert } from "./timer-alert";

const mockOscillator = {
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  frequency: { value: 0 },
  type: "sine",
};

const mockGain = {
  connect: vi.fn(),
  gain: {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  },
};

beforeAll(() => {
  vi.stubGlobal(
    "AudioContext",
    class MockAudioContext {
      createOscillator = () => mockOscillator;
      createGain = () => mockGain;
      destination = {};
      resume = () => Promise.resolve();
    }
  );
});

describe("timer-alert", () => {
  describe("triggerVisualAlert", () => {
    const originalTitle = "UkeDoro";

    beforeEach(() => {
      document.title = originalTitle;
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("sets page title to break message when transitioning to break", () => {
      triggerVisualAlert("break");
      expect(document.title).toBe("⏰ Time for a break! — UkeDoro");
    });

    it("sets page title to work message when transitioning to work", () => {
      triggerVisualAlert("work");
      expect(document.title).toBe("⏰ Back to focus! — UkeDoro");
    });

    it("restores original title after the flash duration", () => {
      triggerVisualAlert("break");
      expect(document.title).toBe("⏰ Time for a break! — UkeDoro");

      vi.advanceTimersByTime(4000);
      expect(document.title).toBe(originalTitle);
    });

    it("clears previous timeout when called again before restore", () => {
      document.title = "First Title";
      triggerVisualAlert("break");
      expect(document.title).toBe("⏰ Time for a break! — UkeDoro");

      triggerVisualAlert("work");
      expect(document.title).toBe("⏰ Back to focus! — UkeDoro");

      vi.advanceTimersByTime(4000);
      expect(document.title).toBe("⏰ Time for a break! — UkeDoro");
    });
  });

  describe("playTimerEndSound", () => {
    it("does not throw when called in browser environment", () => {
      expect(() => playTimerEndSound()).not.toThrow();
    });

    it("creates oscillators and plays two tones when AudioContext resumes", async () => {
      vi.clearAllMocks();
      playTimerEndSound();
      await new Promise((r) => setTimeout(r, 50));
      expect(mockOscillator.start).toHaveBeenCalledTimes(2);
      expect(mockOscillator.stop).toHaveBeenCalledTimes(2);
    });
  });
});

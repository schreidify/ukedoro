import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AccentColor } from "@shared/schema";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workDuration: number;
  setWorkDuration: (val: number) => void;
  breakDuration: number;
  setBreakDuration: (val: number) => void;
  resource: "chords" | "video";
  setResource: (val: "chords" | "video") => void;
  accentColor: AccentColor;
  setAccentColor: (val: AccentColor) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  workDuration,
  setWorkDuration,
  breakDuration,
  setBreakDuration,
  resource,
  setResource,
  accentColor,
  setAccentColor,
}: SettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white border-none shadow-2xl rounded-2xl overflow-hidden font-sans">
        <DialogHeader className="bg-muted/30 p-6 border-b">
          <DialogTitle className="font-display text-2xl">Timer Settings</DialogTitle>
          <DialogDescription>
            Customize your focus sessions and ukulele breaks.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                Focus Duration
              </Label>
              <span className="font-display font-semibold text-lg">{Math.round(workDuration / 60)} min</span>
            </div>
            <Slider 
              value={[workDuration / 60]} 
              min={5} 
              max={60} 
              step={5} 
              onValueChange={(vals) => setWorkDuration(vals[0] * 60)}
              className="[&_[role=slider]]:border-primary [&_[role=slider]]:bg-primary [&>.bg-primary]:bg-primary/20"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-break inline-block"></span>
                Break Duration
              </Label>
              <span className="font-display font-semibold text-lg">{Math.round(breakDuration / 60)} min</span>
            </div>
            <Slider 
              value={[breakDuration / 60]} 
              min={1} 
              max={30} 
              step={1} 
              onValueChange={(vals) => setBreakDuration(vals[0] * 60)}
              className="[&_[role=slider]]:border-break [&_[role=slider]]:bg-break"
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="text-base font-medium">Focus accent</Label>
            <p className="text-sm text-muted-foreground">
              Green or orange for focus controls, stats, and the progress ring.
            </p>
            <RadioGroup
              value={accentColor}
              onValueChange={(v) => setAccentColor(v as AccentColor)}
              className="grid grid-cols-2 gap-3 mt-2"
            >
              <div
                className="flex items-center gap-3 bg-muted/20 p-3 rounded-xl border hover:bg-muted/40 transition-colors cursor-pointer"
                onClick={() => setAccentColor("green")}
              >
                <RadioGroupItem value="green" id="accent-green" />
                <Label htmlFor="accent-green" className="cursor-pointer flex-1 font-medium">
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[hsl(142_76%_36%)] border shadow-sm shrink-0" />
                    Green
                  </span>
                </Label>
              </div>
              <div
                className="flex items-center gap-3 bg-muted/20 p-3 rounded-xl border hover:bg-muted/40 transition-colors cursor-pointer"
                onClick={() => setAccentColor("orange")}
              >
                <RadioGroupItem value="orange" id="accent-orange" />
                <Label htmlFor="accent-orange" className="cursor-pointer flex-1 font-medium">
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[hsl(36_100%_57%)] border shadow-sm shrink-0" />
                    Orange
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="text-base font-medium">Ukulele Break Resource</Label>
            <RadioGroup 
              value={resource} 
              onValueChange={(v) => setResource(v as "chords" | "video")}
              className="flex flex-col space-y-2 mt-2"
            >
              <div className="flex items-center space-x-3 bg-muted/20 p-3 rounded-xl border hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => setResource("chords")}>
                <RadioGroupItem value="chords" id="r-chords" />
                <Label htmlFor="r-chords" className="cursor-pointer flex-1 font-medium">Chord Charts (Static)</Label>
              </div>
              <div className="flex items-center space-x-3 bg-muted/20 p-3 rounded-xl border hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => setResource("video")}>
                <RadioGroupItem value="video" id="r-video" />
                <Label htmlFor="r-video" className="cursor-pointer flex-1 font-medium">YouTube Tutorial (Video)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { motion } from "framer-motion";
import chordsImage from "@/assets/images/chords.png";

interface ResourceViewerProps {
  type: "chords" | "video";
}

export default function ResourceViewer({ type }: ResourceViewerProps) {
  if (type === "chords") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#FAFAFA]" data-testid="resource-viewer-chords">
        <motion.img 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          src={chordsImage} 
          alt="Ukulele Chords" 
          className="w-full max-w-md h-auto object-contain rounded-2xl shadow-sm border border-black/5 mix-blend-multiply"
        />
        <p className="mt-8 text-muted-foreground font-medium text-center max-w-sm">
          Practice transitioning between C, F, G, and Am chords during your break to build muscle memory.
        </p>
      </div>
    );
  }

  // Using a popular beginner ukulele tutorial from YouTube (Cynthia Lin or similar, generic embed)
  // Using a standard embed link that usually allows iframe embedding
  return (
    <div className="w-full h-full flex items-center justify-center bg-black" data-testid="resource-viewer-video">
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/ZzE8NnQxOfA?autoplay=1&mute=0"
        title="Ukulele Tutorial"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
}
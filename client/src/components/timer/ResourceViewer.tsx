import { motion } from "framer-motion";

interface ResourceViewerProps {
  type: "chords" | "video";
}

interface ChordData {
  name: string;
  frets: (number | null)[];
  fingers: (number | null)[];
  barFret?: number;
}

const chords: ChordData[] = [
  { name: "C", frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3] },
  { name: "F", frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  { name: "G", frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  { name: "Am", frets: [2, 0, 0, 0], fingers: [1, 0, 0, 0] },
];

function UkeChordDiagram({ chord, delay }: { chord: ChordData; delay: number }) {
  const strings = 4;
  const frets = 4;
  const width = 120;
  const height = 140;
  const padLeft = 20;
  const padTop = 30;
  const padRight = 16;
  const padBottom = 12;
  const gridW = width - padLeft - padRight;
  const gridH = height - padTop - padBottom;
  const stringSpacing = gridW / (strings - 1);
  const fretSpacing = gridH / frets;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex flex-col items-center"
    >
      <span className="text-lg font-display font-bold text-[#D84315] mb-1">{chord.name}</span>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Nut (thick top bar) */}
        <rect x={padLeft - 2} y={padTop - 3} width={gridW + 4} height={5} rx={2} fill="#333" />

        {/* Fret lines */}
        {Array.from({ length: frets + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={padLeft}
            y1={padTop + i * fretSpacing}
            x2={padLeft + gridW}
            y2={padTop + i * fretSpacing}
            stroke="#999"
            strokeWidth={i === 0 ? 0 : 1.2}
          />
        ))}

        {/* String lines (4 strings for ukulele) */}
        {Array.from({ length: strings }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={padLeft + i * stringSpacing}
            y1={padTop}
            x2={padLeft + i * stringSpacing}
            y2={padTop + gridH}
            stroke="#666"
            strokeWidth={1.2}
          />
        ))}

        {/* Open / Fingered markers */}
        {chord.frets.map((fret, i) => {
          const x = padLeft + i * stringSpacing;
          if (fret === 0) {
            return (
              <circle
                key={`open-${i}`}
                cx={x}
                cy={padTop - 12}
                r={5}
                fill="none"
                stroke="#555"
                strokeWidth={1.5}
              />
            );
          }
          if (fret === null) {
            return (
              <g key={`mute-${i}`}>
                <line x1={x - 4} y1={padTop - 16} x2={x + 4} y2={padTop - 8} stroke="#555" strokeWidth={1.5} />
                <line x1={x + 4} y1={padTop - 16} x2={x - 4} y2={padTop - 8} stroke="#555" strokeWidth={1.5} />
              </g>
            );
          }
          const y = padTop + (fret - 0.5) * fretSpacing;
          return (
            <g key={`finger-${i}`}>
              <circle cx={x} cy={y} r={8} fill="#333" />
              {chord.fingers[i] !== null && chord.fingers[i] !== 0 && (
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={10}
                  fontWeight={600}
                  fontFamily="Roboto, sans-serif"
                >
                  {chord.fingers[i]}
                </text>
              )}
            </g>
          );
        })}

        {/* String labels (G C E A) */}
        {["G", "C", "E", "A"].map((label, i) => (
          <text
            key={`label-${i}`}
            x={padLeft + i * stringSpacing}
            y={padTop + gridH + 14}
            textAnchor="middle"
            fill="#999"
            fontSize={9}
            fontFamily="Roboto, sans-serif"
          >
            {label}
          </text>
        ))}
      </svg>
    </motion.div>
  );
}

export default function ResourceViewer({ type }: ResourceViewerProps) {
  if (type === "chords") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#FAFAFA]" data-testid="resource-viewer-chords">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-8 sm:gap-12 p-8 bg-white rounded-2xl shadow-sm border border-black/5 pt-[0px] pb-[0px]"
        >
          {chords.map((chord, i) => (
            <UkeChordDiagram key={chord.name} chord={chord} delay={0.15 + i * 0.08} />
          ))}
        </motion.div>
        <p className="mt-8 text-muted-foreground font-medium text-center max-w-sm">
          Practice transitioning between C, F, G, and Am chords during your break to build muscle memory.
        </p>
      </div>
    );
  }

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
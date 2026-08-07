const COLORS = ["#e85d2a", "#2a9d8f", "#f4b942", "#e0568c", "#5b8def"];

function randomPiece(i: number) {
  const angle = Math.random() * Math.PI * 2;
  const distance = 60 + Math.random() * 90;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance - 20;
  const rot = (Math.random() - 0.5) * 720;
  const color = COLORS[i % COLORS.length];
  const size = 6 + Math.random() * 5;
  const isRound = i % 2 === 0;

  return {
    key: i,
    style: {
      width: size,
      height: isRound ? size : size * 0.6,
      backgroundColor: color,
      borderRadius: isRound ? "50%" : "2px",
      ["--confetti-x" as string]: `${x}px`,
      ["--confetti-y" as string]: `${y}px`,
      ["--confetti-rot" as string]: `${rot}deg`,
      ["--confetti-duration" as string]: `${700 + Math.random() * 500}ms`,
      ["--confetti-delay" as string]: `${Math.random() * 120}ms`,
    } as React.CSSProperties,
  };
}

export function ConfettiBurst({ count = 28 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => randomPiece(i));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((piece) => (
        <span key={piece.key} className="confetti-piece" style={piece.style} />
      ))}
    </div>
  );
}

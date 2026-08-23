export default function Stamp({ children, tone = "ink", className = "" }) {
  const toneClass =
    {
      ink: "text-ink",
      brass: "text-brass",
      stone: "text-stone",
    }[tone] || "text-ink";

  return <span className={`stamp ${toneClass} ${className}`}>{children}</span>;
}

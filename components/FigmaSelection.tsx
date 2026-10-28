// Cadre de sélection façon Figma : 4 poignées + étiquette orange.
// Visible avec la classe "on", ou au survol d'un parent ".has-sel".
export default function FigmaSelection({
  label,
  on = false,
}: {
  label?: string;
  on?: boolean;
}) {
  return (
    <span className={on ? "fsel on" : "fsel"} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <b>{label}</b>
    </span>
  );
}
